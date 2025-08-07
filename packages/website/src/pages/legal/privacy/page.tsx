import {
  FaShieldAlt,
  FaEye,
  FaDatabase,
  FaCogs,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import { LegalPageLayout, LegalSection, ContactSection } from "@/components/legal";
import { APP_NAME, INTERNAL_LINKS } from "@/config/constants";

export function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title={`${APP_NAME} PRIVACY POLICY`}
      description={`How we collect, use, and protect your data when using ${APP_NAME} CLI`}
      icon={<FaShieldAlt className="h-16 w-16 text-comic-green" />}
      iconColor="bg-comic-green"
      titleColor="text-comic-green"
    >
      {/* Introduction */}
      <LegalSection
        icon={<FaEye className="h-8 w-8 text-comic-blue" />}
        title="1. INTRODUCTION"
        iconColor="text-comic-blue"
      >
        <div className="space-y-4">
          <p className="font-comic text-lg text-comic-darkBlue leading-relaxed">
            {APP_NAME} CLI (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your
            privacy and is committed to protecting your personal data. This Privacy Policy explains
            how we collect, use, and safeguard information when you use our command-line tool.
          </p>
          <p className="font-comic text-lg text-comic-darkBlue leading-relaxed">
            By using {APP_NAME} CLI, you agree to the collection and use of information in
            accordance with this policy.
          </p>
        </div>
      </LegalSection>

      {/* What We Collect */}
      <LegalSection
        icon={<FaDatabase className="h-8 w-8 text-comic-purple" />}
        title="2. INFORMATION WE COLLECT"
        iconColor="text-comic-purple"
        delay={0.1}
      >
        {/* Anonymous Telemetry Data */}
        <div className="bg-comic-blue bg-opacity-10 p-6 rounded-lg border-4 border-comic-blue mb-6">
          <h3 className="font-comic text-2xl font-bold text-comic-blue mb-4">
            Anonymous Telemetry Data
          </h3>
          <p className="font-comic text-lg text-comic-darkBlue leading-relaxed mb-4">
            We collect anonymous usage statistics to improve {APP_NAME} CLI. This data includes:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-comic-white p-6 rounded-lg border-4 border-comic-green">
              <h4 className="font-comic text-xl font-bold text-comic-green mb-3 flex items-center">
                <FaCheckCircle className="h-5 w-5 mr-2" />
                What We DO Collect:
              </h4>
              <ul className="font-comic text-lg text-comic-darkBlue space-y-2">
                <li>• Framework selections (React, Vue, etc.)</li>
                <li>• Backend choices (Express, NestJS, etc.)</li>
                <li>• Database preferences (PostgreSQL, MongoDB, etc.)</li>
                <li>• Styling selections (Tailwind, CSS, etc.)</li>
                <li>• Command execution success/failure rates</li>
                <li>• CLI performance metrics</li>
                <li>• Error types and frequencies (anonymized)</li>
                <li>• Operating system and Node.js version</li>
                <li>• Package manager used (npm, yarn, pnpm, bun)</li>
                <li>• Project generation duration</li>
              </ul>
            </div>

            <div className="bg-comic-white p-6 rounded-lg border-4 border-comic-red">
              <h4 className="font-comic text-xl font-bold text-comic-red mb-3 flex items-center">
                <FaTimesCircle className="h-5 w-5 mr-2" />
                What We DO NOT Collect:
              </h4>
              <ul className="font-comic text-lg text-comic-darkBlue space-y-2">
                <li>• Your name, email, or contact information</li>
                <li>• IP addresses or location data</li>
                <li>• Source code or project content</li>
                <li>• File names or directory structures</li>
                <li>• Environment variables or secrets</li>
                <li>• Personal or sensitive project details</li>
                <li>• Network requests or API calls</li>
                <li>• Browser history or cookies</li>
                <li>• Any personally identifiable information</li>
              </ul>
            </div>
          </div>

          <div className="bg-comic-yellow p-6 rounded-lg border-4 border-comic-black mt-6">
            <h4 className="font-comic text-xl font-bold text-comic-darkBlue mb-3">
              Example Telemetry Event:
            </h4>
            <pre className="font-mono text-sm text-comic-darkBlue bg-comic-white p-4 rounded border-2 border-comic-black overflow-x-auto">
              {`{
  "event": "project_created",
  "framework": "react",
  "backend": "express",
  "database": "postgres",
  "styling": "tailwind",
  "success": true,
  "duration_ms": 8432,
  "node_version": "20.x",
  "os": "linux",
  "package_manager": "bun",
  "timestamp": "2024-01-15T10:30:00Z",
  "session_id": "abc123...def" // Random UUID, not linked to you
}`}
            </pre>
          </div>
        </div>

        {/* Website Analytics */}
        <div className="bg-comic-green bg-opacity-10 p-6 rounded-lg border-4 border-comic-green">
          <h3 className="font-comic text-2xl font-bold text-comic-green mb-4">
            Website Analytics ({new URL(INTERNAL_LINKS.PRECAST_URL).hostname})
          </h3>
          <p className="font-comic text-lg text-comic-darkBlue leading-relaxed mb-4">
            Our website at {INTERNAL_LINKS.PRECAST_URL} uses Google Analytics 4 to understand how
            users interact with our site:
          </p>
          <ul className="font-comic text-lg text-comic-darkBlue ml-6 space-y-2">
            <li>• Page views and session duration</li>
            <li>• Geographic location (country/city level)</li>
            <li>• Device and browser information</li>
            <li>• Traffic sources and referrers</li>
            <li>• User interactions with the visual builder</li>
          </ul>
          <div className="bg-comic-white p-4 rounded-lg border-2 border-comic-green mt-4">
            <p className="font-comic text-lg text-comic-darkBlue">
              You can opt out of Google Analytics using browser extensions or your browser&apos;s Do
              Not Track setting.
            </p>
          </div>
        </div>
      </LegalSection>

      {/* How We Use Data */}
      <LegalSection
        icon={<FaCogs className="h-8 w-8 text-comic-purple" />}
        title="3. HOW WE USE YOUR INFORMATION"
        iconColor="text-comic-purple"
        delay={0.2}
      >
        <div className="space-y-4">
          <p className="font-comic text-lg text-comic-darkBlue leading-relaxed">
            We use the collected information for the following purposes:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-comic-purple bg-opacity-10 p-4 rounded-lg border-2 border-comic-purple">
                <p className="font-comic text-lg text-comic-darkBlue">
                  <strong>Improve CLI Performance:</strong> Identify slow operations and optimize
                  common workflows for {APP_NAME}
                </p>
              </div>
              <div className="bg-comic-red bg-opacity-10 p-4 rounded-lg border-2 border-comic-red">
                <p className="font-comic text-lg text-comic-darkBlue">
                  <strong>Fix Bugs:</strong> Detect error patterns and prioritize fixes for common
                  issues
                </p>
              </div>
              <div className="bg-comic-blue bg-opacity-10 p-4 rounded-lg border-2 border-comic-blue">
                <p className="font-comic text-lg text-comic-darkBlue">
                  <strong>Feature Development:</strong> Understand which frameworks and technologies
                  are most popular for {APP_NAME} users
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-comic-green bg-opacity-10 p-4 rounded-lg border-2 border-comic-green">
                <p className="font-comic text-lg text-comic-darkBlue">
                  <strong>Compatibility Testing:</strong> Ensure {APP_NAME} works across different
                  environments
                </p>
              </div>
              <div className="bg-comic-yellow bg-opacity-10 p-4 rounded-lg border-2 border-comic-orange">
                <p className="font-comic text-lg text-comic-darkBlue">
                  <strong>Usage Statistics:</strong> Display anonymous usage metrics on our website
                </p>
              </div>
              <div className="bg-comic-teal bg-opacity-10 p-4 rounded-lg border-2 border-comic-teal">
                <p className="font-comic text-lg text-comic-darkBlue">
                  <strong>Security:</strong> Identify potential security issues in generated code
                  patterns
                </p>
              </div>
            </div>
          </div>
        </div>
      </LegalSection>

      {/* Opting Out */}
      <LegalSection
        icon={<FaCogs className="h-8 w-8 text-comic-red" />}
        title="4. HOW TO OPT OUT"
        iconColor="text-comic-red"
        delay={0.3}
      >
        <div className="flex items-center mb-6">
          <div className="ml-auto bg-comic-red text-comic-white px-4 py-2 rounded-full font-comic font-bold text-lg transform rotate-3">
            YOUR CHOICE!
          </div>
        </div>

        <p className="font-comic text-lg text-comic-darkBlue leading-relaxed mb-6">
          You have complete control over telemetry collection. You can disable it at any time:
        </p>

        <div className="space-y-6">
          <div className="bg-comic-white p-6 rounded-lg border-4 border-comic-black">
            <h4 className="font-comic text-xl font-bold text-comic-red mb-3">
              Method 1: Environment Variable
            </h4>
            <pre className="bg-comic-black text-comic-green p-4 rounded font-mono text-lg">
              export TELEMETRY_DISABLED=true
            </pre>
            <p className="font-comic text-lg text-comic-darkBlue mt-3">
              Add this to your ~/.bashrc, ~/.zshrc, or ~/.profile
            </p>
          </div>

          <div className="bg-comic-white p-6 rounded-lg border-4 border-comic-black">
            <h4 className="font-comic text-xl font-bold text-comic-red mb-3">Method 2: CLI Flag</h4>
            <pre className="bg-comic-black text-comic-green p-4 rounded font-mono text-lg">
              {APP_NAME.toLowerCase()} init my-project --no-telemetry
            </pre>
            <p className="font-comic text-lg text-comic-darkBlue mt-3">
              Disable telemetry for a single command
            </p>
          </div>

          <div className="bg-comic-white p-6 rounded-lg border-4 border-comic-black">
            <h4 className="font-comic text-xl font-bold text-comic-red mb-3">
              Method 3: Config File
            </h4>
            <pre className="bg-comic-black text-comic-green p-4 rounded font-mono text-lg">
              {`// ${APP_NAME.toLowerCase()}.config.js
module.exports = {
  telemetry: false
}`}
            </pre>
            <p className="font-comic text-lg text-comic-darkBlue mt-3">
              Disable telemetry project-wide
            </p>
          </div>
        </div>

        <div className="bg-comic-green text-comic-white p-6 rounded-lg border-4 border-comic-black mt-6">
          <p className="font-comic text-lg leading-relaxed">
            <strong>Once disabled:</strong> No telemetry data will be collected or transmitted. The
            CLI will function normally without any impact on performance or features.
          </p>
        </div>
      </LegalSection>

      {/* Third Party Services */}
      <LegalSection
        icon={<FaDatabase className="h-8 w-8 text-comic-blue" />}
        title="5. THIRD-PARTY SERVICES"
        iconColor="text-comic-blue"
        delay={0.4}
      >
        <div className="space-y-4">
          <p className="font-comic text-lg text-comic-darkBlue leading-relaxed">
            {APP_NAME} integrates with various third-party services that have their own privacy
            policies:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-comic-blue bg-opacity-10 p-6 rounded-lg border-2 border-comic-blue">
              <h4 className="font-comic text-xl font-bold text-comic-blue mb-3">
                Analytics Services
              </h4>
              <ul className="font-comic text-lg text-comic-darkBlue space-y-2">
                <li>• Google Analytics (website)</li>
                <li>• PostHog (telemetry processing)</li>
              </ul>
            </div>

            <div className="bg-comic-green bg-opacity-10 p-6 rounded-lg border-2 border-comic-green">
              <h4 className="font-comic text-xl font-bold text-comic-green mb-3">
                Package Registries
              </h4>
              <ul className="font-comic text-lg text-comic-darkBlue space-y-2">
                <li>• npm registry</li>
                <li>• GitHub Package Registry</li>
                <li>• jsDelivr CDN</li>
              </ul>
            </div>
          </div>

          <div className="bg-comic-yellow p-4 rounded-lg border-4 border-comic-black">
            <p className="font-comic text-lg text-comic-darkBlue">
              These services may collect their own data when you use {APP_NAME}. Please review their
              respective privacy policies.
            </p>
          </div>
        </div>
      </LegalSection>

      {/* Contact Section */}
      <ContactSection delay={0.5} emailType="LEGAL" title="CONTACT US" />
    </LegalPageLayout>
  );
}
