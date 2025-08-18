# Auth Feature - Enterprise Layout Integration

## Overview

The Auth feature provides enterprise-ready authentication components that automatically integrate into your existing project layouts. Instead of creating new layouts, it intelligently modifies your current layout files to wrap them with the AuthProvider.

## How Layout Integration Works

### 🎯 Smart Detection

The system automatically detects your project structure and identifies the correct layout files:

- **Next.js App Router**: `src/app/layout.tsx`
- **React/Vite**: `src/App.tsx`
- **Vue.js**: `src/App.vue`
- **Nuxt**: `layouts/default.vue` (creates if missing)
- **SvelteKit**: `src/routes/+layout.svelte`

### 🔧 Automatic Integration Process

When you run `precast add auth`, the system:

1. **Analyzes your existing layout** - Reads your current layout files
2. **Validates compatibility** - Ensures the framework supports auth integration
3. **Adds AuthProvider import** - Inserts the import statement at the top
4. **Wraps existing content** - Wraps your current layout with `<AuthProvider>`
5. **Preserves existing structure** - Keeps all your existing code intact

### 📝 Example Transformations

#### Next.js App Router - Before:

```tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
        <PrecastWidget />
      </body>
    </html>
  );
}
```

#### Next.js App Router - After:

```tsx
import { AuthProvider } from "@/features/auth";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
        <PrecastWidget />
      </body>
    </html>
  );
}
```

#### React Router - Before:

```tsx
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
```

#### React Router - After:

```tsx
import { AuthProvider } from "@/features/auth";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
```

## Enterprise Features

### 🔐 Role-Based Access Control

```tsx
import { useAuthContext } from "@/features/auth";

function AdminDashboard() {
  const { user, hasRole } = useAuthContext();

  if (!hasRole("admin")) {
    return <AccessDenied />;
  }

  return <DashboardContent />;
}
```

### 🛡️ Protected Routes

```tsx
import { ProtectedRoute } from '@/features/auth';

// In your router
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>

// Admin-only route
<Route
  path="/admin"
  element={
    <ProtectedRoute adminOnly>
      <AdminPage />
    </ProtectedRoute>
  }
/>
```

### 🏢 Multi-Tenant Support

```tsx
const { tenant } = useTenant();

// Different features per tenant
if (tenant.features.includes("advanced-analytics")) {
  return <AdvancedAnalytics />;
}
```

## Integration Benefits

### ✅ Zero Breaking Changes

- Your existing layouts continue to work exactly as before
- No need to rewrite or restructure your app
- All existing routes and components remain functional

### ✅ Framework Agnostic

- Works with Next.js, React, Vue, Nuxt, SvelteKit
- Automatically detects and adapts to your framework
- Uses framework-specific patterns (e.g., 'use client' for Next.js)

### ✅ Enterprise Ready

- Role-based access control out of the box
- Multi-tenant architecture support
- Audit logging and security features
- Production-tested authentication flows

### ✅ Developer Experience

- TypeScript support with full type safety
- Beautiful, accessible UI components
- Dark mode support
- Comprehensive error handling

## Advanced Configuration

### Custom Layout Integration

If you have a custom layout structure, you can manually integrate:

```tsx
// In your root layout file
import { AuthProvider } from "@/features/auth";

export function CustomLayout({ children }) {
  return (
    <AuthProvider>
      <YourExistingLayout>{children}</YourExistingLayout>
    </AuthProvider>
  );
}
```

### Environment-Specific Settings

```tsx
// config/auth.ts
export const authConfig = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  sessionTimeout: process.env.NODE_ENV === "production" ? 30 * 60 * 1000 : 60 * 60 * 1000,
  features: {
    socialLogin: process.env.ENABLE_SOCIAL_LOGIN === "true",
    multiTenant: process.env.ENABLE_MULTI_TENANT === "true",
  },
};
```

## Security Best Practices

### 🔒 Session Management

- Automatic session refresh
- Secure cookie handling
- CSRF protection
- XSS prevention

### 🔒 API Security

- JWT token validation
- Rate limiting support
- Request signing
- Audit trail logging

### 🔒 Data Protection

- PII encryption
- GDPR compliance helpers
- Data retention policies
- Access logging

## Troubleshooting

### Common Issues

**AuthProvider not found error:**

```bash
# Check if feature was installed correctly
precast add auth --check

# Reinstall if needed
precast add auth --force
```

**Layout not wrapping correctly:**

```bash
# Check current integration
grep -r "AuthProvider" src/

# Manual verification
precast add auth --dry-run
```

**TypeScript errors:**

- Ensure `@/features/auth` path is configured in `tsconfig.json`
- Restart TypeScript server in your IDE
- Check that all auth dependencies are installed

## Support

For enterprise support and custom integrations:

- Documentation: [precast.dev/docs/auth](https://precast.dev/docs/auth)
- GitHub: [github.com/precast-app/issues](https://github.com/precast-app/issues)
- Enterprise: enterprise@precast.dev

---

The Auth feature is designed to be the foundation of your enterprise application's security layer, integrating seamlessly with your existing architecture while providing the scalability and features needed for production applications.
