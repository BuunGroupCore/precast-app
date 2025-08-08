/**
 * @fileoverview GitHub App authentication service with PKCS#1 to PKCS#8 conversion
 * @module services/github-auth
 */

import { API_CONFIG, RATE_LIMITS } from "../config/constants";
import type { GitHubTokenResponse } from "../types";

/**
 * Handles GitHub App authentication and JWT token generation.
 * Automatically converts PKCS#1 keys to PKCS#8 format for Web Crypto API compatibility.
 *
 * @class GitHubAuthService
 */
export class GitHubAuthService {
  private readonly appId: string;
  private readonly privateKey: string;
  private readonly installationId: string;
  private cachedToken: string | null = null;
  private tokenExpiry: number = 0;

  /**
   * Creates an instance of GitHubAuthService
   * @param {string} appId - GitHub App ID
   * @param {string} privateKey - GitHub App private key (PKCS#1 format supported)
   * @param {string} installationId - GitHub App installation ID
   */
  constructor(appId: string, privateKey: string, installationId: string) {
    this.appId = appId;
    this.privateKey = privateKey.replace(/\\n/g, "\n");
    this.installationId = installationId;
  }

  /**
   * Converts PKCS#1 (RSA) private key to PKCS#8 format
   * @private
   * @param {string} pkcs1Pem - PKCS#1 formatted private key
   * @returns {string} PKCS#8 formatted private key
   */
  private convertPKCS1toPKCS8(pkcs1Pem: string): string {
    const base64 = pkcs1Pem
      .replace(/-----BEGIN RSA PRIVATE KEY-----/g, "")
      .replace(/-----END RSA PRIVATE KEY-----/g, "")
      .replace(/\s/g, "");

    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const pkcs8Header = [
      0x30,
      0x82,
      0x00,
      0x00, // SEQUENCE
      0x02,
      0x01,
      0x00, // INTEGER version
      0x30,
      0x0d, // SEQUENCE AlgorithmIdentifier
      0x06,
      0x09, // OBJECT IDENTIFIER
      0x2a,
      0x86,
      0x48,
      0x86,
      0xf7,
      0x0d,
      0x01,
      0x01,
      0x01, // rsaEncryption
      0x05,
      0x00, // NULL
      0x04,
      0x82,
      0x00,
      0x00, // OCTET STRING
    ];

    const keyLength = bytes.length;
    const totalLength = pkcs8Header.length + keyLength;
    const pkcs8 = new Uint8Array(totalLength);

    for (let i = 0; i < pkcs8Header.length; i++) {
      pkcs8[i] = pkcs8Header[i];
    }

    pkcs8[2] = ((totalLength - 4) >> 8) & 0xff;
    pkcs8[3] = (totalLength - 4) & 0xff;
    pkcs8[24] = (keyLength >> 8) & 0xff;
    pkcs8[25] = keyLength & 0xff;

    for (let i = 0; i < keyLength; i++) {
      pkcs8[pkcs8Header.length + i] = bytes[i];
    }

    let binary = "";
    for (let i = 0; i < pkcs8.length; i++) {
      binary += String.fromCharCode(pkcs8[i]);
    }
    const base64Result = btoa(binary);

    const lines = [];
    for (let i = 0; i < base64Result.length; i += 64) {
      lines.push(base64Result.substring(i, i + 64));
    }

    return `-----BEGIN PRIVATE KEY-----\n${lines.join("\n")}\n-----END PRIVATE KEY-----`;
  }

  /**
   * Creates a JWT for GitHub App authentication
   * @private
   * @returns {Promise<string>} Signed JWT token
   */
  private async createJWT(): Promise<string> {
    const now = Math.floor(Date.now() / 1000);

    const header = {
      alg: "RS256",
      typ: "JWT",
    };

    const payload = {
      iat: now - 60,
      exp: now + 600,
      iss: this.appId,
    };

    const encodedHeader = this.base64urlEncode(JSON.stringify(header));
    const encodedPayload = this.base64urlEncode(JSON.stringify(payload));
    const message = `${encodedHeader}.${encodedPayload}`;

    const pkcs8Key = this.convertPKCS1toPKCS8(this.privateKey);
    const keyData = this.pemToArrayBuffer(pkcs8Key);

    const cryptoKey = await crypto.subtle.importKey(
      "pkcs8",
      keyData,
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-256",
      },
      false,
      ["sign"]
    );

    const encoder = new TextEncoder();
    const signature = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      encoder.encode(message)
    );

    const encodedSignature = this.base64urlEncode(new Uint8Array(signature));

    return `${message}.${encodedSignature}`;
  }

  /**
   * Converts PEM formatted key to ArrayBuffer
   * @private
   * @param {string} pem - PEM formatted key
   * @returns {ArrayBuffer} Key as ArrayBuffer
   */
  private pemToArrayBuffer(pem: string): ArrayBuffer {
    const base64 = pem
      .replace(/-----BEGIN PRIVATE KEY-----/g, "")
      .replace(/-----END PRIVATE KEY-----/g, "")
      .replace(/\s/g, "");

    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Base64url encodes a string or Uint8Array
   * @private
   * @param {string | Uint8Array} input - Data to encode
   * @returns {string} Base64url encoded string
   */
  private base64urlEncode(input: string | Uint8Array): string {
    let base64: string;
    if (typeof input === "string") {
      base64 = btoa(input);
    } else {
      let binary = "";
      for (let i = 0; i < input.length; i++) {
        binary += String.fromCharCode(input[i]);
      }
      base64 = btoa(binary);
    }

    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }

  /**
   * Generates or retrieves a cached GitHub installation access token
   * @returns {Promise<string>} Valid installation access token
   * @throws {Error} If authentication fails
   */
  async getInstallationToken(): Promise<string> {
    const now = Date.now();
    if (this.cachedToken && this.tokenExpiry > now) {
      return this.cachedToken;
    }

    const jwt = await this.createJWT();

    const response = await fetch(
      `${API_CONFIG.GITHUB_BASE_URL}/app/installations/${this.installationId}/access_tokens`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": API_CONFIG.USER_AGENT,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get installation token: ${response.status} - ${error}`);
    }

    const data = (await response.json()) as GitHubTokenResponse;

    this.cachedToken = data.token;
    this.tokenExpiry = now + RATE_LIMITS.TOKEN_CACHE_DURATION;

    if (data.expires_at) {
      const expiryTime = new Date(data.expires_at).getTime();
      this.tokenExpiry = expiryTime - RATE_LIMITS.TOKEN_EXPIRY_BUFFER;
    }

    return data.token;
  }

  /**
   * Gets authenticated headers for GitHub API requests
   * @returns {Promise<Object>} Headers object with authorization
   */
  async getAuthHeaders(): Promise<{ Authorization: string; Accept: string }> {
    const token = await this.getInstallationToken();
    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    };
  }
}
