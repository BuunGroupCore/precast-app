# Security Features in create-precast-app

## Overview

The create-precast-app CLI includes several security features to ensure that generated projects are secure and free from known vulnerabilities.

## Automatic Security Features

### 1. Security Audit on Installation

When you create a new project with `create-precast-app`, the CLI automatically:

- Runs `npm audit` after installing dependencies
- Attempts to fix vulnerabilities with `npm audit fix`
- Falls back to `npm audit fix --force` for breaking changes if needed
- Reports any remaining vulnerabilities that need manual attention

### 2. Dependency Version Management

All template dependencies are kept up-to-date with the latest secure versions:

- **Vite**: Updated to v7.0.6+ (fixes esbuild vulnerability CVE-2024-23334)
- **TypeScript**: Updated to v5.7.2+
- **ESLint**: Updated to v9.19.0+
- Other dependencies are regularly updated

### 3. esbuild Vulnerability Mitigation

For projects using Vite or Angular, we automatically add package overrides to ensure esbuild v0.25.0+ is used:

```json
{
  "overrides": {
    "esbuild": "^0.25.0",
    "@angular/build": {
      "vite": {
        "esbuild": "^0.25.0"
      }
    },
    "vite": {
      "esbuild": "^0.25.0"
    }
  }
}
```

## Manual Security Commands

### Check for vulnerabilities

```bash
npm run security:check
```

### Update template dependencies

```bash
npm run update:templates
```

### Fix vulnerabilities

```bash
npm run audit:fix
```

## Automated Updates

We use GitHub Actions to automatically:

- Check for dependency updates weekly
- Create PRs with security updates
- Run security audits on every build

## Reporting Security Issues

If you discover a security vulnerability in create-precast-app, please report it to:

- GitHub Issues: https://github.com/BuunGroupCore/precast-app/issues
- Mark the issue as security-related

## Best Practices for Generated Projects

1. **Regular Updates**: Run `npm audit` regularly in your generated projects
2. **CI/CD Integration**: Add security scanning to your build pipeline
3. **Dependency Management**: Keep dependencies up-to-date
4. **Use Lock Files**: Always commit package-lock.json to ensure consistent installs

## Known Issues and Workarounds

### Prisma with Bun

Prisma requires Node.js for postinstall scripts. The CLI automatically falls back to npm when Prisma is detected.

### Development-only Vulnerabilities

Some vulnerabilities (like the esbuild issue) only affect development environments. While these are lower risk, we still fix them proactively.

## Security Audit in CI/CD

Add this to your GitHub Actions workflow:

```yaml
- name: Security Audit
  run: |
    npm audit --audit-level=moderate
    npm audit fix --audit-level=moderate || true
```

## Compliance

The security features help with:

- OWASP dependency checking requirements
- SOC 2 compliance for dependency management
- General security best practices
