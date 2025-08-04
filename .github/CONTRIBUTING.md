# 🦸‍♂️ Contributing to Precast CLI

Thank you for your interest in contributing to Precast! We're excited to have you join our league of developer heroes. This guide will help you get started.

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** (we recommend using the latest LTS version)
- **Git** for version control
- Your favorite code editor (we love VS Code with extensions!)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/precast-app.git
   cd precast-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Build the Project**
   ```bash
   npm run build
   ```

4. **Test Your Setup**
   ```bash
   npm test
   ```

## 🎯 Ways to Contribute

### 🐛 Bug Reports
Found a bug? We want to hear about it! Please use our [bug report template](.github/ISSUE_TEMPLATE/bug_report.md).

### ✨ Feature Requests
Have an idea for a new feature? Submit a [feature request](.github/ISSUE_TEMPLATE/feature_request.md).

### 📋 New Templates
Want to add support for a new framework or tech stack? Use our [template request](.github/ISSUE_TEMPLATE/template_request.md).

### 🚀 Code Contributions
Ready to write some code? Here's how:

1. **Find an Issue**: Look for issues labeled `good first issue` or `help wanted`
2. **Discuss First**: Comment on the issue to discuss your approach
3. **Create a Branch**: `git checkout -b feature/your-feature-name`
4. **Write Code**: Follow our coding standards (see below)
5. **Test Everything**: Make sure all tests pass
6. **Submit a PR**: Use our pull request template

## 📋 Development Guidelines

### Code Style

We use ESLint and Prettier to maintain consistent code style:

```bash
# Check code style
npm run lint

# Fix style issues
npm run lint:fix

# Format code
npm run format
```

### Commit Messages

We follow conventional commit format:

```
type(scope): description

Example:
feat(cli): add support for Bun package manager
fix(templates): resolve TypeScript config issue
docs: update contributing guidelines
```

### Testing

- **Write tests** for new features and bug fixes
- **Run all tests** before submitting: `npm test`
- **Test manually** with different combinations:
  ```bash
  # Test different package managers
  npm run test:npm
  npm run test:yarn
  npm run test:pnpm
  npm run test:bun
  ```

### Templates

When adding new templates:

1. **Follow existing structure** in `src/templates/`
2. **Include proper configuration** files
3. **Add comprehensive documentation**
4. **Test with multiple setups**
5. **Update CLI options** if needed

## 🏗️ Project Structure

```
precast-app/
├── packages/
│   ├── cli/                 # Main CLI package
│   │   ├── src/
│   │   │   ├── commands/    # CLI commands
│   │   │   ├── templates/   # Project templates
│   │   │   ├── utils/       # Utility functions
│   │   │   └── generators/  # Template generators
│   │   └── tests/           # Test files
│   ├── ui/                  # UI components
│   ├── hooks/               # React hooks
│   ├── utils/               # Shared utilities
│   └── website/             # Documentation website
└── .github/                 # GitHub templates
```

## 🧪 Testing

### Manual Testing Checklist

When testing templates or features:

- [ ] Works with npm, yarn, pnpm, and bun
- [ ] Works on Windows, macOS, and Linux
- [ ] Generates clean, working projects
- [ ] All dependencies install correctly
- [ ] Development server starts without errors
- [ ] Build process completes successfully
- [ ] TypeScript compilation (if applicable)
- [ ] Linting passes
- [ ] Tests run (if included)

### Automated Tests

Run the full test suite:

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# End-to-end tests
npm run test:e2e

# All tests
npm test
```

## 📚 Documentation

### Updating Documentation

- **CLI Help**: Update command descriptions in source code
- **README**: Keep usage examples up to date  
- **Website**: Update docs in `packages/website/src/pages/DocsPage.tsx`
- **Comments**: Add JSDoc comments for complex functions

### Writing Good Documentation

- **Be clear and concise**
- **Include code examples**
- **Cover edge cases**
- **Update when you change behavior**

## 🎉 Recognition

Contributors are recognized in several ways:

- **GitHub Contributors** page
- **Changelog** mentions
- **Social media** shoutouts
- **Sponsor tiers** for significant contributions

## 🤝 Community Guidelines

### Be Respectful
- **Treat everyone** with kindness and respect
- **Welcome newcomers** and help them get started
- **Give constructive feedback** in reviews
- **Assume good intentions** in discussions

### Be Collaborative
- **Discuss before implementing** large changes
- **Ask for help** when you need it
- **Share knowledge** and learn from others
- **Celebrate successes** together

## 🆘 Getting Help

### Need Help?

- **GitHub Discussions**: General questions and ideas
- **Issues**: Bug reports and feature requests
- **Discord**: Real-time community chat
- **Email**: maintainers@precast.dev

### Stuck on Something?

Don't hesitate to ask! We're here to help:

1. **Check existing issues** and discussions
2. **Ask in GitHub Discussions**
3. **Tag maintainers** if needed
4. **Join our Discord** for quick help

## 🎯 Good First Issues

New to contributing? Look for these labels:

- `good first issue`: Perfect for beginners
- `help wanted`: We need community help
- `documentation`: Improve our docs
- `template`: Add new project templates

## 🚀 Release Process

We follow semantic versioning:

- **Patch** (1.0.1): Bug fixes
- **Minor** (1.1.0): New features (backward compatible)
- **Major** (2.0.0): Breaking changes

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

## 🦸‍♂️ Join the League of Heroes!

Every contribution, no matter how small, makes Precast better for developers worldwide. Whether you're fixing a typo, adding a feature, or helping other users, you're making a difference!

**Thank you for being awesome!** 🌟

---

*Happy coding, hero!* ⚡