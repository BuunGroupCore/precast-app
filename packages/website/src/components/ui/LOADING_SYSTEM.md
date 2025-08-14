# Loading System Documentation

This document provides comprehensive documentation for the unified loading system implemented across the Precast website. The loading system is designed to provide consistent, accessible, and theme-appropriate loading states throughout the application.

## Overview

The loading system consists of several components and hooks that work together to provide:

- **Consistent visual design** following the comic book theme
- **Accessibility support** with proper ARIA attributes and reduced motion support
- **Global state management** for coordinating loading states across components
- **Progressive loading** for large datasets
- **Optimistic updates** for better user experience
- **Comprehensive error handling** with retry mechanisms

## Components

### LoadingSpinner

A versatile spinner component with multiple variants and sizes.

```tsx
import { LoadingSpinner, InlineSpinner } from "@/components/ui";

// Basic usage
<LoadingSpinner />

// Customized
<LoadingSpinner
  size="lg"
  variant="spinner"
  color="blue"
  message="Loading data..."
  aria-label="Loading user data"
/>

// Inline usage
<p>Processing <InlineSpinner color="blue" /> please wait...</p>
```

**Props:**

- `size`: "xs" | "sm" | "md" | "lg" | "xl"
- `variant`: "dots" | "spinner" | "pulse" | "bounce"
- `color`: "red" | "blue" | "purple" | "green" | "yellow" | "orange"
- `message`: Optional message to display
- `aria-label`: Accessibility label

### LoadingOverlay

Full-screen loading overlays with customizable backdrops.

```tsx
import { LoadingOverlay, SimpleLoadingOverlay } from "@/components/ui";

// Full overlay with close option
<LoadingOverlay
  isVisible={loading}
  message="Processing your request..."
  variant="dots"
  color="purple"
  backdrop="blur"
  onClose={() => setLoading(false)}
/>

// Simple overlay
<SimpleLoadingOverlay
  isVisible={uploading}
  message="Uploading file..."
  variant="progress"
/>
```

### Skeleton Loaders

Skeleton components for content placeholders.

```tsx
import { Skeleton, SkeletonComponents } from "@/components/ui";

// Pre-built components
<SkeletonComponents.Text lines={3} />
<SkeletonComponents.Card />
<SkeletonComponents.MetricCard />
<SkeletonComponents.Chart />
<SkeletonComponents.Avatar size="lg" />
<SkeletonComponents.Button size="md" />

// Custom skeleton
<Skeleton
  variant="rectangular"
  width="100%"
  height="200px"
  animation="wave"
/>
```

### Progress Bars

Animated progress indicators with multiple styles.

```tsx
import { ProgressBar, IndeterminateProgressBar } from "@/components/ui";

// Determinate progress
<ProgressBar
  value={75}
  label="Upload Progress"
  showPercentage={true}
  variant="striped"
  color="green"
/>

// Indeterminate progress
<IndeterminateProgressBar
  label="Processing..."
  color="blue"
/>
```

### Global Loading Indicators

Application-wide loading state indicators.

```tsx
import { GlobalLoadingIndicator, GlobalProgressBar } from "@/components/ui";

// In your App.tsx
<GlobalProgressBar />
<GlobalLoadingIndicator
  variant="detailed"
  position="top-right"
  showTaskCount={true}
/>
```

## Hooks

### useAsync

Hook for managing async operations with loading states.

```tsx
import { useAsync } from "@/hooks";

const fetchData = async () => {
  const response = await api.getData();
  return response.data;
};

const { data, loading, error, execute, reset } = useAsync(fetchData, {
  immediate: false,
  onSuccess: (data) => console.log("Success!", data),
  onError: (error) => console.error("Error:", error),
});
```

### useLoading

Hook for managing multiple named loading states.

```tsx
import { useLoading } from "@/hooks";

const { loading, isLoading, setLoading, withLoading } = useLoading(["data", "form", "upload"]);

// Check specific loading state
if (isLoading("data")) {
  // Show data loading UI
}

// Execute with loading wrapper
await withLoading("upload", uploadFile());
```

### useProgressiveLoading

Hook for loading large datasets in batches.

```tsx
import { useProgressiveLoading } from "@/hooks";

const { items, loading, progress, hasMore, loadNext, loadAll } = useProgressiveLoading(
  largeDataset,
  {
    batchSize: 20,
    delay: 100,
  }
);
```

### useGlobalLoading & useLoadingTask

Hooks for managing global loading states.

```tsx
import { useLoadingTask } from "@/contexts/LoadingContext";

const task = useLoadingTask("my-operation");

// Start a loading task
task.start("Processing data...");

// Update progress
task.setProgress(75);

// Execute with automatic loading management
await task.withLoading(asyncOperation(), "Custom message");
```

## Context Providers

### LoadingProvider

Wrap your app with the LoadingProvider to enable global loading state management.

```tsx
import { LoadingProvider } from "@/contexts/LoadingContext";

function App() {
  return <LoadingProvider>{/* Your app components */}</LoadingProvider>;
}
```

## Configuration

The loading system uses centralized configuration for consistency:

```tsx
import { LOADING_CONFIG, getTimeout, getBatchSize } from "@/config/loading";

// Use predefined timeouts
const timeout = getTimeout("MEDIUM"); // 15 seconds

// Use predefined batch sizes
const batchSize = getBatchSize("LARGE"); // 20 items

// Access default configurations
const defaultSpinner = LOADING_CONFIG.DEFAULTS.SPINNER;
```

## Accessibility Features

The loading system includes comprehensive accessibility support:

- **ARIA attributes**: All loading components include proper `role`, `aria-label`, and `aria-live` attributes
- **Screen reader support**: Descriptive text and status updates for screen readers
- **Reduced motion**: Respects `prefers-reduced-motion` setting
- **Keyboard navigation**: Loading overlays can be dismissed with the Escape key
- **Focus management**: Proper focus handling during loading states

## Best Practices

### 1. Choose the Right Component

- Use `InlineSpinner` for small, inline loading states
- Use `LoadingSpinner` for dedicated loading areas
- Use `SkeletonComponents` for content placeholders
- Use `LoadingOverlay` for blocking operations
- Use `ProgressBar` when progress can be measured

### 2. Provide Meaningful Messages

```tsx
// Good
<LoadingSpinner message="Fetching your projects..." />

// Better
<LoadingSpinner
  message="Loading projects..."
  aria-label="Loading your project list"
/>
```

### 3. Handle Error States

```tsx
const { data, loading, error, execute } = useAsync(fetchData);

if (loading) return <LoadingSpinner message="Loading..." />;
if (error) return <ErrorMessage error={error} onRetry={execute} />;
if (data) return <DataDisplay data={data} />;
```

### 4. Use Progressive Loading for Large Lists

```tsx
const { items, hasMore, loadNext, loading } = useProgressiveLoading(largeDataset, {
  batchSize: 20,
});

return (
  <div>
    {items.map((item) => (
      <ItemCard key={item.id} item={item} />
    ))}
    {hasMore && (
      <button onClick={loadNext} disabled={loading}>
        {loading ? <InlineSpinner /> : "Load More"}
      </button>
    )}
  </div>
);
```

### 5. Coordinate Global Loading States

```tsx
const uploadTask = useLoadingTask("file-upload");

const handleUpload = async (file) => {
  try {
    uploadTask.start("Uploading file...");
    uploadTask.setProgress(0);

    await uploadWithProgress(file, (progress) => {
      uploadTask.setProgress(progress);
    });

    uploadTask.stop();
  } catch (error) {
    uploadTask.stop();
    // Handle error
  }
};
```

## Theme Integration

All loading components are designed to match the comic book theme:

- **Colors**: Use the comic color palette (red, blue, purple, etc.)
- **Borders**: Comic-style borders with proper shadows
- **Animations**: Playful animations that fit the theme
- **Typography**: Uses comic fonts and styling

## Performance Considerations

- **Debounced loading**: Short operations don't show loading immediately
- **Virtualization**: Large lists use progressive loading
- **Caching**: API responses are cached to reduce loading states
- **Cleanup**: All async operations are properly cleaned up to prevent memory leaks

## Examples

See `LoadingExamples.tsx` for comprehensive examples of all loading components and patterns in action.

## Migration Guide

If you're updating existing components to use the new loading system:

1. Replace custom loading spinners with `LoadingSpinner`
2. Add skeleton loading states using `SkeletonComponents`
3. Update async operations to use `useAsync` or `useLoading`
4. Add global loading tasks for major operations
5. Ensure proper accessibility attributes

## Troubleshooting

### Common Issues

1. **Loading state not updating**: Ensure you're using the loading state correctly and that async operations are properly handled
2. **Accessibility warnings**: Make sure all loading components have proper `aria-label` attributes
3. **Performance issues**: Consider using progressive loading for large datasets
4. **Theme inconsistencies**: Use the predefined color and size options

For more help, refer to the individual component documentation or check the examples in `LoadingExamples.tsx`.
