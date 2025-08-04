# Publishing Guide for create-precast-app

This guide explains how to publish the CLI package to npm.

## Prerequisites

1. **npm Account**: Make sure you have an npm account and are logged in
   ```bash
   npm login
   ```

2. **npm Token**: For CI/CD, set up an npm token in your GitHub repository secrets as `NPM_TOKEN`

3. **Permissions**: Ensure you have publish permissions for the `create-precast-app` package

## Publishing Process

### 1. Pre-publish Checklist

- [ ] All tests pass: `bun run test`
- [ ] Code is linted: `bun run lint`
- [ ] TypeScript compiles: `bun run typecheck`
- [ ] Build works: `bun run build`
- [ ] CLI functions correctly: Test manually with `node dist/cli.js init test-app --framework=react --yes`
- [ ] CHANGELOG.md is updated
- [ ] Version number is appropriate

### 2. Manual Publishing

#### Beta Release
```bash
# For beta/prerelease versions
bun run publish:beta
```

#### Production Release
```bash
# For patch releases (0.1.0 -> 0.1.1)
bun run publish:patch

# For minor releases (0.1.0 -> 0.2.0)
bun run publish:minor

# For major releases (0.1.0 -> 1.0.0)
bun run publish:major
```

### 3. Automated Publishing via GitHub Actions

#### Beta Release
1. Push to main branch
2. Go to GitHub Actions
3. Run "Publish CLI Package" workflow manually
4. Select "beta" tag

#### Production Release
1. Create and push a git tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
2. GitHub Actions will automatically publish to npm

### 4. What Gets Published

The published package includes:
- `dist/` - Compiled JavaScript files and templates
- `README.md` - Package documentation
- `CHANGELOG.md` - Version history
- `LICENSE` - MIT license
- `package.json` - Package metadata

### 5. Package Structure

```
create-precast-app@0.1.0
├── dist/
│   ├── cli.js                 # Main CLI executable
│   ├── index.js              # Package entry point
│   ├── chunk-*.js            # Code chunks
│   └── templates/            # All framework templates
├── package.json
├── README.md
├── CHANGELOG.md
└── LICENSE
```

### 6. Installation & Usage

Once published, users can install and use the CLI:

```bash
# Install globally
npm install -g create-precast-app

# Or use directly with npx
npx create-precast-app my-app

# Or use with other package managers
pnpm dlx create-precast-app my-app
bunx create-precast-app my-app
```

### 7. Verification

After publishing, verify the package:

1. **Check npm page**: Visit https://www.npmjs.com/package/create-precast-app
2. **Test installation**: `npm install -g create-precast-app@latest`
3. **Test functionality**: `create-precast-app test-app --framework=react --yes`
4. **Check version**: `create-precast-app --version`

### 8. Troubleshooting

#### Build Issues
- Ensure all dependencies are installed: `bun install`
- Clear build cache: `rm -rf dist dist-test`
- Rebuild: `bun run build`

#### Publishing Issues
- Check npm login: `npm whoami`
- Verify package name availability: `npm view create-precast-app`
- Check permissions: Contact package maintainers

#### Template Issues
- Verify templates directory exists in dist: `ls -la dist/templates`
- Test template resolution: Run CLI with verbose output

### 9. Post-publish Tasks

- [ ] Update documentation if needed
- [ ] Announce release on relevant channels
- [ ] Monitor for issues and feedback
- [ ] Update downstream dependencies if needed

## Package Configuration

The package is configured with:
- **Public access**: Anyone can install it
- **ESM format**: Modern JavaScript modules
- **Node.js 18+**: Minimum supported version
- **Executable binary**: `create-precast-app` command
- **Template bundling**: All templates included in package