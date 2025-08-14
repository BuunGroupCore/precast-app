# Adding New Services to PrecastWidget

This guide provides step-by-step instructions for extending the PrecastWidget with new service testing capabilities.

## Overview

The PrecastWidget uses a modular architecture that makes adding new services straightforward. Each service follows a standardized pattern and integrates seamlessly with the existing UI and testing framework.

## Service Types

Services are categorized into different types:

- **Infrastructure** - APIs, databases, caching, storage
- **Monitoring** - Error tracking, analytics, logging
- **Communication** - Email, SMS, notifications
- **Payment** - Payment processors, billing systems
- **Auth** - Authentication providers, identity services
- **Analytics** - Tracking, metrics, user behavior

## Step-by-Step Guide

### 1. Create the Service Testing Module

Create a new file in the `services/` directory following the naming pattern: `[serviceName]Service.ts.hbs`

```typescript
// services/sentryService.ts.hbs
import { TestResult, ServiceTestContext } from '../types';

{{#if (includes plugins 'sentry')}}
/**
 * Test Sentry error tracking service
 */
export const testSentryService = async (
  setLoading: (updater: (prev: Record<string, boolean>) => Record<string, boolean>) => void,
  addTestResult: (service: string, result: Omit<TestResult, "timestamp">) => void,
  apiUrl: string
): Promise<void> => {
  setLoading((prev) => ({ ...prev, sentry: true }));
  try {
    // Test Sentry error endpoint
    const response = await fetch(`${apiUrl}/api/test/sentry-error`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        message: "Test error from PrecastWidget",
        level: "info"
      }),
    });

    const data = await response.json();

    if (response.ok) {
      addTestResult("sentry", {
        success: true,
        message: "SENTRY ERROR TRACKED",
        details: {
          provider: "Sentry",
          eventId: data.eventId,
          status: "Error successfully sent to Sentry"
        },
      });
    } else {
      addTestResult("sentry", {
        success: false,
        message: "SENTRY TEST FAILED",
        details: data.error || "Failed to send test error",
      });
    }
  } catch (error) {
    addTestResult("sentry", {
      success: false,
      message: "SENTRY SERVICE ERROR",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  } finally {
    setLoading((prev) => ({ ...prev, sentry: false }));
  }
};

/**
 * Simplified Sentry test for service registry
 */
export const testSentryServiceSimple = async (context: ServiceTestContext): Promise<TestResult> => {
  try {
    const response = await fetch(`${context.apiUrl}/api/test/sentry-error`, {
      method: "POST",
      headers: context.headers,
      credentials: "include",
      body: JSON.stringify({
        message: "Test error from PrecastWidget",
        level: "info"
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: "SENTRY ERROR TRACKED",
        details: {
          provider: "Sentry",
          eventId: data.eventId,
          status: "Error successfully sent to Sentry"
        },
        timestamp: new Date().toISOString(),
      };
    } else {
      return {
        success: false,
        message: "SENTRY TEST FAILED",
        details: data.error || "Failed to send test error",
        timestamp: new Date().toISOString(),
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "SENTRY SERVICE ERROR",
      details: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Check if Sentry service is available
 */
export const isSentryServiceAvailable = (): boolean => {
  return true; // Available when Sentry plugin is configured
};
{{else}}
// No Sentry configured
export const testSentryService = async (): Promise<void> => {
  console.warn('Sentry service not configured');
};

export const testSentryServiceSimple = async (): Promise<TestResult> => {
  return {
    success: false,
    message: "SENTRY NOT CONFIGURED",
    details: "Sentry is not configured for this project",
    timestamp: new Date().toISOString(),
  };
};

export const isSentryServiceAvailable = (): boolean => {
  return false;
};
{{/if}}
```

### 2. Register the Service

Add your service to the service registry in `services/serviceRegistry.ts.hbs`:

```typescript
// In getAvailableServices function
{{#if (includes plugins 'sentry')}}
// Sentry error tracking service
services.sentry = {
  key: 'sentry',
  name: 'ERROR TRACKING',
  type: 'sentry',
  icon: 'sentry',
  category: 'monitoring',
  testFunction: 'testSentryService',
  healthEndpoint: '/api/test/sentry-error',
};
{{/if}}
```

### 3. Add Icon Mapping

Update `utils/serviceIcons.ts.hbs` to include an icon for your service:

```typescript
// Add to iconMap in getServiceIcon function
sentry: <SiSentry {...iconProps} />,

// Add to iconMap import at top of file
import { SiSentry } from 'react-icons/si';

// Add to category mapping in getIconCategory function
sentry: 'monitoring',

// Add to hasServiceIcon function
const iconMap = [
  // ... existing icons
  'sentry',
];
```

### 4. Update Main Widget Component

Add your service test handler to `PrecastWidget.tsx.hbs`:

```typescript
// Import your service
import { testSentryService } from './services/sentryService';

// Add handler function
{{#if (includes plugins 'sentry')}}
const handleTestSentry = () => {
  testSentryService(setLoading, addTestResult, systemInfo?.apiPort ? `http://localhost:${systemInfo.apiPort}` : 'http://localhost:3001');
};
{{/if}}

// Add to ServicePanel props
{{#if (includes plugins 'sentry')}}
onTestSentry={handleTestSentry}
{{/if}}
```

### 5. Update ServiceCard Component

Modify `components/ServiceCard.tsx.hbs` to handle your new service:

```typescript
interface ServiceCardProps {
  // ... existing props
  onTestSentry?: () => void;
}

// Add to getTestFunction switch statement
case 'sentry':
  return onTestSentry;

// Add to test button condition
{(serviceKey === 'database' || serviceKey === 'api' || serviceKey === 'email' || serviceKey === 'docker' || serviceKey === 'sentry') && testFunction && (
```

### 6. Update ServicePanel Component

Add the new service prop to `components/ServicePanel.tsx.hbs`:

```typescript
interface ServicePanelProps {
  // ... existing props
  onTestSentry?: () => void;
}

// Pass to ServiceCard
onTestSentry = { onTestSentry };
```

### 7. Export from Index

Add your service exports to `index.ts.hbs`:

```typescript
// Services (for advanced usage)
export {
  testSentryService,
  testSentryServiceSimple,
  isSentryServiceAvailable,
} from "./services/sentryService";
```

### 8. Add Backend API Endpoint (Optional)

If your service requires a backend endpoint, add it to the health routes template:

```typescript
// In templates/widgets/precast-widget/api/health-routes.ts.hbs

{{#if (includes plugins 'sentry')}}
// POST /api/test/sentry-error - Test Sentry error tracking
router.post('/test/sentry-error', async (req: Request, res: Response) => {
  try {
    // Import and use Sentry SDK
    const Sentry = require('@sentry/node');

    const { message, level = 'info' } = req.body;

    // Send test error to Sentry
    const eventId = Sentry.captureMessage(message, level);

    res.json({
      success: true,
      eventId,
      message: 'Test error sent to Sentry'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send error to Sentry'
    });
  }
});
{{/if}}
```

## Advanced Patterns

### Custom UI Components

For services that need custom UI (like authentication forms), create a dedicated component:

```typescript
// components/SentryTestForm.tsx.hbs
interface SentryTestFormProps {
  onTest: (errorLevel: string, message: string) => void;
  isLoading: boolean;
}

export function SentryTestForm({ onTest, isLoading }: SentryTestFormProps) {
  const [errorLevel, setErrorLevel] = useState('info');
  const [message, setMessage] = useState('Test error from PrecastWidget');

  return (
    <div className="space-y-3">
      <select
        value={errorLevel}
        onChange={(e) => setErrorLevel(e.target.value)}
        className="w-full px-3 py-2 border-2 border-black"
      >
        <option value="info">Info</option>
        <option value="warning">Warning</option>
        <option value="error">Error</option>
        <option value="fatal">Fatal</option>
      </select>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Error message"
        className="w-full px-3 py-2 border-2 border-black"
      />

      <TestButton
        onClick={() => onTest(errorLevel, message)}
        isLoading={isLoading}
      >
        SEND TEST ERROR
      </TestButton>
    </div>
  );
}
```

### Service-Specific State

For services that need custom state management:

```typescript
// hooks/useSentryTesting.ts.hbs
export function useSentryTesting() {
  const [errorLevel, setErrorLevel] = useState("info");
  const [customMessage, setCustomMessage] = useState("");
  const [recentEvents, setRecentEvents] = useState<string[]>([]);

  const sendTestError = useCallback(async (level: string, message: string) => {
    // Custom testing logic
  }, []);

  return {
    errorLevel,
    setErrorLevel,
    customMessage,
    setCustomMessage,
    recentEvents,
    sendTestError,
  };
}
```

### Configuration Validation

Add validation for service-specific configuration:

```typescript
// utils/serviceValidation.ts.hbs
export function validateSentryConfig(config: PrecastConfig): boolean {
  return Boolean(config.plugins?.includes("sentry") && process.env.SENTRY_DSN);
}
```

## Testing Your New Service

### 1. Create Test Project

```bash
./dist/cli.js init test-sentry --framework react --backend express --plugins sentry --yes
cd test-sentry
```

### 2. Verify Service Appears

1. Start the development server
2. Open the PrecastWidget
3. Confirm your service tab appears
4. Test the service functionality

### 3. Test Different Configurations

Test your service with different project configurations:

```bash
# Test with different backends
./dist/cli.js init test-sentry-fastify --framework react --backend fastify --plugins sentry

# Test with different frameworks
./dist/cli.js init test-sentry-vue --framework vue --backend express --plugins sentry
```

## Common Patterns

### Health Check Pattern

Most services follow this pattern:

```typescript
const response = await fetch(`${apiUrl}/api/service/health`);
const data = await response.json();

if (response.ok) {
  return {
    success: true,
    message: "SERVICE HEALTHY",
    details: data,
    timestamp: new Date().toISOString(),
  };
}
```

### Error Handling Pattern

Consistent error handling across services:

```typescript
try {
  // Service test logic
} catch (error) {
  return {
    success: false,
    message: "SERVICE ERROR",
    details: error instanceof Error ? error.message : "Unknown error",
    timestamp: new Date().toISOString(),
  };
}
```

### Loading State Pattern

Standard loading state management:

```typescript
setLoading((prev) => ({ ...prev, serviceName: true }));
try {
  // Test logic
} finally {
  setLoading((prev) => ({ ...prev, serviceName: false }));
}
```

## Configuration Integration

### Handlebars Conditions

Use Handlebars conditions to include services based on project configuration:

```handlebars
{{#if (includes plugins "serviceName")}}
  // Service implementation
{{/if}}

{{#if (eq authProvider "provider-name")}}
  // Auth provider specific code
{{/if}}

{{#if database}}
  // Database-dependent features
{{/if}}
```

### Environment Variables

Access environment variables appropriately for each framework:

```typescript
// Framework-specific env access
{{#if (eq framework "next")}}
const serviceUrl = process.env.NEXT_PUBLIC_SERVICE_URL;
{{else}}
const serviceUrl = import.meta.env.VITE_SERVICE_URL;
{{/if}}
```

## Best Practices

### 1. **Consistency**

- Follow existing naming conventions
- Use the same error handling patterns
- Maintain consistent UI styling

### 2. **Extensibility**

- Design for future enhancements
- Use generic interfaces where possible
- Document configuration requirements

### 3. **Performance**

- Avoid heavy computations in render
- Use React.memo for expensive components
- Implement proper loading states

### 4. **Accessibility**

- Include proper ARIA labels
- Ensure keyboard navigation works
- Use semantic HTML elements

### 5. **Testing**

- Test with multiple project configurations
- Verify error states handle gracefully
- Check loading states work correctly

## Troubleshooting

### Service Not Appearing

1. Check Handlebars conditions in `serviceRegistry.ts.hbs`
2. Verify icon mapping in `serviceIcons.ts.hbs`
3. Ensure proper exports in `index.ts.hbs`

### Test Button Not Working

1. Verify test function is properly registered
2. Check ServiceCard component includes your service
3. Ensure proper prop passing through components

### TypeScript Errors

1. Add proper type definitions to `types/index.ts.hbs`
2. Export types from `index.ts.hbs`
3. Ensure consistent interface usage

### Styling Issues

1. Use existing CSS classes for consistency
2. Check both Tailwind and fallback CSS paths
3. Test with different styling configurations

## Examples

See the existing services for reference implementations:

- **Simple Service**: `emailService.ts.hbs`
- **Complex Service**: `authService.ts.hbs`
- **Infrastructure Service**: `dockerService.ts.hbs`
- **Payment Service**: `paymentService.ts.hbs`

## Support

For questions about adding new services:

1. Check existing service implementations for patterns
2. Review the main README.md for architecture overview
3. Test your implementation thoroughly
4. Submit pull requests with comprehensive testing

---

**Happy coding! 🚀**
