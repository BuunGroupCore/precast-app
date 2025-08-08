# Precast Documentation

Welcome to the Precast documentation! This directory contains guides and references for using and contributing to Precast.

## 📚 Documentation Structure

### [Setup Guides](./setup/)
Configuration and setup instructions for:
- [GitHub App for automated releases](./setup/github-app-releases.md)
- [Release workflow configuration](./setup/release-workflow.md)
- Repository secrets and environment variables

### [CLI Documentation](./cli/)
Complete guide to the Precast CLI:
- **[Main Guide](./cli/README.md)** - Installation, quick start, and overview
- **[Command Reference](./cli/commands.md)** - Complete command documentation
- **[Configuration Guide](./cli/configuration.md)** - Stack compatibility and setup
- **[Templates Guide](./cli/templates.md)** - Understanding project templates
- **[Examples](./cli/examples.md)** - Real-world usage examples and patterns
- **[Troubleshooting](./cli/troubleshooting.md)** - Common issues and solutions

### [Website Documentation](./website/)
*Coming soon*
- Development setup
- Component library
- Deployment guide
- Analytics configuration

### [Contributing](./contributing/)
*Coming soon*
- Development workflow
- Code style guide
- Testing guidelines
- Pull request process

## 🚀 Quick Links

### For Users
- [Create your first project](https://precast.app)
- [CLI on npm](https://www.npmjs.com/package/create-precast-app)
- [Visual Builder](https://precast.app/builder)

### For Contributors
- [Set up GitHub App](./setup/github-app-releases.md) for automated releases
- [Understand the release workflow](./setup/release-workflow.md)
- [Report issues](https://github.com/yourusername/precast-app/issues)

### For Maintainers
- [Release process](./setup/release-workflow.md#how-releases-work)
- [Deployment configuration](./setup/release-workflow.md#deployment-configuration)
- [Rollback procedures](./setup/release-workflow.md#rollback-process)

## 📖 Getting Started

### Using the CLI

```bash
# Create a new project
bunx create-precast-app@latest my-app

# With specific options
bunx create-precast-app@latest my-app \
  --framework react \
  --backend express \
  --database postgres \
  --orm prisma
```

### Using the Visual Builder

1. Visit [precast.app/builder](https://precast.app/builder)
2. Select your tech stack visually
3. Copy the generated command
4. Run in your terminal

## 🛠️ Development

### Prerequisites
- Node.js 18+
- pnpm 8.15.1+
- Git

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/precast-app.git

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run development mode
pnpm dev
```

## 📝 Documentation Standards

When contributing to documentation:

1. **Use clear headings** - Organize content hierarchically
2. **Include examples** - Show, don't just tell
3. **Keep it current** - Update docs with code changes
4. **Test procedures** - Verify steps work as written
5. **Add diagrams** - Visual aids where helpful

## 🤝 Contributing

We welcome contributions to our documentation! See our [contribution guidelines](./contributing/README.md) for details.

### Ways to Contribute
- Fix typos and grammar
- Clarify confusing sections
- Add missing information
- Create new guides
- Translate documentation

## 📞 Support

- **Documentation Issues**: [Open an issue](https://github.com/yourusername/precast-app/issues/new?labels=documentation)
- **Questions**: [Start a discussion](https://github.com/yourusername/precast-app/discussions)
- **Security**: Email security@precast.app

## 📄 License

This documentation is part of the Precast project and is licensed under the same terms. See the [LICENSE](../LICENSE) file for details.

---

*Documentation version: 1.0.0*  
*Last updated: January 2025*