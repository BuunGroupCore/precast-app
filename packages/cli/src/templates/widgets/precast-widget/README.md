# PrecastWidget - Modular Service Testing System

A comprehensive, extensible service validation widget for testing Docker containers, databases, APIs, authentication, and other services in development environments.

## Overview

The PrecastWidget has been refactored from a monolithic 1,356-line component into a modular, maintainable architecture while preserving 100% of the original functionality. This refactoring enables easy extension for new services and improved code organization.

## Architecture

### Directory Structure

```
components/precast/
├── README.md                       # This file
├── index.ts.hbs                    # Main barrel export
├── PrecastWidget.tsx.hbs           # Main orchestrator component
├── hooks/                          # Custom React hooks
│   ├── usePrecastConfig.ts.hbs     # Configuration loading
│   ├── useSystemInfo.ts.hbs        # System information fetching
│   ├── useServiceRegistry.ts.hbs   # Service discovery and management
│   ├── useGenericTesting.ts.hbs    # Test result management
│   └── useApiRequest.ts.hbs        # API request utilities
├── components/                     # UI Components
│   ├── FloatingButton.tsx.hbs      # Floating trigger button
│   ├── ServicePanel.tsx.hbs        # Main panel container
│   ├── ServiceTabBar.tsx.hbs       # Side tab navigation
│   ├── ServiceCard.tsx.hbs         # Individual service display
│   ├── TestButton.tsx.hbs          # Reusable test button
│   ├── ResultDisplay.tsx.hbs       # Test result visualization
│   ├── AuthTestForm.tsx.hbs        # Authentication testing UI
│   └── DockerContainerList.tsx.hbs # Docker container display
├── services/                       # Service Testing Logic
│   ├── serviceRegistry.ts.hbs      # Service registration system
│   ├── baseService.ts.hbs          # Abstract service interface
│   ├── apiService.ts.hbs           # API health testing
│   ├── databaseService.ts.hbs      # Database connection testing
│   ├── dockerService.ts.hbs        # Docker container testing
│   ├── authService.ts.hbs          # Authentication testing
│   ├── emailService.ts.hbs         # Email service testing
│   └── paymentService.ts.hbs       # Payment service testing
├── utils/                          # Utility Functions
│   ├── serviceIcons.ts.hbs         # Icon mapping
│   ├── environmentUtils.ts.hbs     # Environment-specific utilities
│   └── constants.ts.hbs            # Shared constants
├── types/                          # TypeScript Definitions
│   └── index.ts.hbs                # All interfaces and types
└── docs/                           # Documentation
    └── adding-services.md          # Guide for adding new services
```

## Key Features

### ✅ **Preserved Functionality**

- **Exact same UI/UX** - Zero visual or behavioral changes
- **Framework compatibility** - Works across React, Vue, Angular, etc.
- **Handlebars templating** - Dynamic configuration based on project setup
- **Development-only mode** - Only appears in development environments
- **All service tests** - API, Database, Docker, Auth, Email, Payment

### 🔧 **Extensibility Improvements**

- **Plugin-like architecture** - Easy to add new service tests
- **Service registration system** - Automatic service discovery
- **Standardized interfaces** - Consistent patterns for all services
- **Comprehensive documentation** - Clear guides for extending functionality

### 🏗️ **Modular Architecture**

- **Separation of concerns** - Each file has a single responsibility
- **Reusable components** - Components can be used independently
- **Custom hooks** - Shareable business logic
- **Type safety** - Comprehensive TypeScript support

## Usage

### Basic Usage

```typescript
import { PrecastWidget } from '@/components/precast';

function App() {
  return (
    <div>
      {/* Your app content */}
      <PrecastWidget />
    </div>
  );
}
```

### Advanced Usage

```typescript
import {
  useServiceRegistry,
  useGenericTesting,
  ServiceCard
} from '@/components/precast';

function CustomServiceTester() {
  const { services } = useServiceRegistry(config);
  const { testResults, runTest } = useGenericTesting();

  return (
    <div>
      {Object.values(services).map(service => (
        <ServiceCard
          key={service.key}
          service={service}
          testResults={testResults}
          // ... other props
        />
      ))}
    </div>
  );
}
```

## Supported Services

### Core Infrastructure

- **API** - Backend health checks
- **Database** - Connection testing (PostgreSQL, MySQL, MongoDB)
- **Docker** - Container status validation

### Authentication

- **Better Auth** - Authentication provider testing
- **Auth.js** - Session and provider validation
- **Generic Auth** - Custom authentication systems

### Communication

- **Email** - Resend service testing
- **SendGrid** - Alternative email provider (extensible)

### Payment

- **Stripe** - Payment service validation

### Monitoring (Extensible)

- **Sentry** - Error tracking (ready to implement)
- **Analytics** - Google Analytics integration (ready to implement)

## Service Registration System

Services are automatically registered based on project configuration:

```typescript
// serviceRegistry.ts.hbs
export function getAvailableServices(config: PrecastConfig) {
  const services: Record<string, ServiceDefinition> = {};

  // Services auto-register based on Handlebars conditions
  {{#if backend}}
  services.api = {
    key: 'api',
    name: 'API',
    type: '{{backend}}',
    icon: 'server',
    category: 'infrastructure',
    testFunction: 'testApiHealth',
  };
  {{/if}}

  // More services...
  return services;
}
```

## Adding New Services

See [docs/adding-services.md](./docs/adding-services.md) for a comprehensive guide on extending the widget with new service tests.

### Quick Example: Adding Sentry

1. **Create service file**: `services/sentryService.ts.hbs`
2. **Add to registry**: Update `serviceRegistry.ts.hbs`
3. **Add icon mapping**: Update `utils/serviceIcons.ts.hbs`
4. **Add configuration**: Use Handlebars conditions

```typescript
// services/sentryService.ts.hbs
{{#if (includes plugins 'sentry')}}
export const testSentryService = async (context: ServiceTestContext) => {
  // Test Sentry error tracking
  const response = await fetch(`${context.apiUrl}/api/test/sentry-error`);
  return {
    success: response.ok,
    message: response.ok ? "SENTRY ACTIVE" : "SENTRY ERROR",
    details: await response.json(),
    timestamp: new Date().toISOString(),
  };
};
{{/if}}
```

## Configuration

The widget automatically detects services based on:

1. **Project configuration** (`precast.jsonc`)
2. **Handlebars build-time variables**
3. **Environment variables**
4. **Runtime service discovery**

## Styling

Supports both styling approaches:

- **Tailwind CSS** - When `styling === 'tailwind'`
- **Pure CSS** - Fallback with custom CSS classes

The widget maintains the brutalist design system with yellow accents and bold borders.

## Testing

Each service includes both legacy and modern testing functions:

```typescript
// Legacy format (for compatibility)
export const testApiHealth = async (setLoading, addTestResult, apiUrl) => {
  // Original function signature
};

// Modern format (for new integrations)
export const testApiHealthSimple = async (context: ServiceTestContext) => {
  // Simplified, standardized interface
};
```

## Performance

- **Lazy loading** - Components load only when needed
- **Optimized re-renders** - React hooks prevent unnecessary updates
- **Efficient state management** - Centralized test result storage
- **Bundle optimization** - Tree-shakeable exports

## Framework Compatibility

The widget works across all supported frameworks through Handlebars templating:

- **React** - Primary implementation
- **Vue** - Planned implementation
- **Angular** - Planned implementation
- **Svelte** - Planned implementation

## Development

### Building

```bash
# The widget is built as part of the CLI template system
cd packages/cli
bun run build
```

### Testing Locally

```bash
# Create a test project
./dist/cli.js init test-widget --framework react --backend express --database postgres --install --yes

# Run the project
cd test-widget
npm run dev
```

### Contributing

1. **Follow existing patterns** - Maintain consistency with current architecture
2. **Add TypeScript types** - All new code should be fully typed
3. **Update documentation** - Include examples and usage instructions
4. **Test thoroughly** - Ensure compatibility across frameworks
5. **Maintain backwards compatibility** - Preserve existing functionality

## Migration from Monolithic Version

The modular version is a **drop-in replacement** for the original PrecastWidget:

- **Same import path** - `import { PrecastWidget } from '@/components/precast'`
- **Same props interface** - No changes to component usage
- **Same functionality** - All features preserved exactly
- **Same styling** - Visual appearance unchanged

## Troubleshooting

### Common Issues

1. **Missing icons** - Check `serviceIcons.ts.hbs` for new service mappings
2. **Service not appearing** - Verify Handlebars conditions in `serviceRegistry.ts.hbs`
3. **TypeScript errors** - Ensure all types are exported from `types/index.ts.hbs`
4. **Test failures** - Check API endpoints and service configuration

### Debug Mode

Enable debug logging by setting localStorage:

```javascript
localStorage.setItem("precast-debug", "true");
```

## License

This widget is part of the Precast CLI project and follows the same licensing terms.

## Support

- **Documentation** - See [adding-services.md](./docs/adding-services.md)
- **Examples** - Check generated test projects
- **Issues** - Report bugs via GitHub issues
- **Community** - Join the Precast Discord for support

---

**Made with ❤️ by the Precast team**
