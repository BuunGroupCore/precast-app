# Enterprise Auth Integration Examples

## Framework Integration Patterns

### Next.js App Router Integration

**`app/layout.tsx`** - Root Layout with Auth Provider

```tsx
import { EnterpriseLayout } from "@/features/auth/layouts/EnterpriseLayout";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <EnterpriseLayout>{children}</EnterpriseLayout>
      </body>
    </html>
  );
}
```

**`app/dashboard/layout.tsx`** - Protected Dashboard Layout

```tsx
import { ProtectedRoute } from "@/features/auth/layouts/EnterpriseLayout";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm">
          <nav className="mt-8">
            <a href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Overview
            </a>
            <a href="/dashboard/users" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Users
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
```

**`app/admin/layout.tsx`** - Admin-Only Layout

```tsx
import { ProtectedRoute } from "@/features/auth/layouts/EnterpriseLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>Administrator Area:</strong> You have elevated privileges.
              </p>
            </div>
          </div>
        </div>
        {children}
      </div>
    </ProtectedRoute>
  );
}
```

### React Router Integration

**`src/App.tsx`** - Main App with Router

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EnterpriseLayout, ProtectedRoute } from "@/features/auth/layouts/EnterpriseLayout";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <EnterpriseLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </EnterpriseLayout>
    </BrowserRouter>
  );
}

export default App;
```

### Vue.js + Nuxt Integration

**`layouts/default.vue`** - Default Layout with Auth

```vue
<template>
  <div id="app">
    <AuthProvider>
      <EnterpriseChrome>
        <slot />
      </EnterpriseChrome>
    </AuthProvider>
  </div>
</template>

<script setup>
import { AuthProvider } from "@/features/auth/AuthProvider";
import EnterpriseChrome from "@/features/auth/layouts/EnterpriseChrome.vue";
</script>
```

**`middleware/auth.ts`** - Auth Middleware

```ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { $auth } = useNuxtApp();

  if (!$auth.isAuthenticated) {
    return navigateTo("/login");
  }
});
```

**`middleware/admin.ts`** - Admin Middleware

```ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { $auth } = useNuxtApp();

  if (!$auth.isAuthenticated) {
    return navigateTo("/login");
  }

  if (!$auth.user?.roles?.includes("admin")) {
    throw createError({
      statusCode: 403,
      statusMessage: "Access Denied",
    });
  }
});
```

## Enterprise Features

### Role-Based Access Control (RBAC)

```tsx
// Enhanced User type with roles
interface EnterpriseUser extends User {
  roles: string[];
  permissions: string[];
  department?: string;
  manager?: string;
}

// Permission checker hook
function usePermissions() {
  const { user } = useAuthContext();

  const hasRole = (role: string) => user?.roles?.includes(role) ?? false;
  const hasPermission = (permission: string) => user?.permissions?.includes(permission) ?? false;
  const isAdmin = () => hasRole("admin");
  const isManager = () => hasRole("manager") || hasRole("admin");

  return { hasRole, hasPermission, isAdmin, isManager };
}

// Permission-based component
function PermissionGate({
  children,
  role,
  permission,
  fallback = null,
}: {
  children: React.ReactNode;
  role?: string;
  permission?: string;
  fallback?: React.ReactNode;
}) {
  const { hasRole, hasPermission } = usePermissions();

  const hasAccess = role ? hasRole(role) : permission ? hasPermission(permission) : true;

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
```

### Multi-Tenant Support

```tsx
interface TenantContext {
  tenantId: string;
  tenantName: string;
  tenantLogo?: string;
  features: string[];
}

function TenantProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();
  const [tenant, setTenant] = useState<TenantContext | null>(null);

  useEffect(() => {
    if (user?.tenantId) {
      // Fetch tenant information
      fetchTenant(user.tenantId).then(setTenant);
    }
  }, [user]);

  return <TenantContext.Provider value={tenant}>{children}</TenantContext.Provider>;
}
```

### Audit Logging

```tsx
function useAuditLog() {
  const { user } = useAuthContext();

  const logAction = useCallback(
    (action: string, resource: string, details?: any) => {
      if (!user) return;

      fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          action,
          resource,
          details,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          ipAddress: "server-determined",
        }),
      });
    },
    [user]
  );

  return { logAction };
}
```

## Integration Best Practices

### 1. Environment-Specific Configuration

```tsx
// config/auth.ts
export const authConfig = {
  development: {
    apiUrl: "http://localhost:3001",
    redirectUrl: "http://localhost:3000",
    sessionTimeout: 60 * 60 * 1000, // 1 hour
  },
  production: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    redirectUrl: process.env.NEXT_PUBLIC_APP_URL,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
  },
};
```

### 2. Error Boundary Integration

```tsx
function AuthErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Authentication Error</h2>
            <p className="text-gray-600 mb-4">
              There was a problem with authentication. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Reload Page
            </button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
```

### 3. Loading States and Skeleton UI

```tsx
function AuthLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="h-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-full">
          <div className="h-8 w-48 bg-gray-300 rounded"></div>
          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="space-y-4">
          <div className="h-8 w-64 bg-gray-300 rounded"></div>
          <div className="h-32 w-full bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}
```

This enterprise integration provides:

✅ **Layout-level Auth Wrapping** - AuthProvider wraps the entire app
✅ **Role-based Access Control** - Admin-only areas and permissions
✅ **Framework Agnostic** - Works with Next.js, React Router, Vue/Nuxt
✅ **Enterprise Features** - Multi-tenant, audit logging, RBAC
✅ **Production Ready** - Error boundaries, loading states, proper TypeScript
✅ **Security Best Practices** - Proper session management and access control
