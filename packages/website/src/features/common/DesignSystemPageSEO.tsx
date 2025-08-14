import { Helmet } from "react-helmet-async";

export function DesignSystemPageSEO() {
  return (
    <Helmet>
      <title>Design System - Comic Book UI Components | Precast</title>
      <meta
        name="description"
        content="Explore Precast's comic book themed design system. Interactive components, design tokens, playground, and comprehensive guidelines for building super-powered web interfaces."
      />
      <meta
        name="keywords"
        content="design system, UI components, comic book theme, React components, design tokens, component library, web development, TypeScript"
      />

      {/* Open Graph */}
      <meta property="og:title" content="Design System - Comic Book UI Components | Precast" />
      <meta
        property="og:description"
        content="Explore Precast's comic book themed design system. Interactive components, design tokens, playground, and comprehensive guidelines."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://precast.app/design-system" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Design System - Comic Book UI Components | Precast" />
      <meta
        name="twitter:description"
        content="Explore Precast's comic book themed design system. Interactive components, design tokens, playground, and comprehensive guidelines."
      />

      {/* Canonical */}
      <link rel="canonical" href="https://precast.app/design-system" />
    </Helmet>
  );
}

export function DesignSystemTokensPageSEO() {
  return (
    <Helmet>
      <title>Design Tokens - Colors, Typography & Spacing | Precast Design System</title>
      <meta
        name="description"
        content="Comprehensive design tokens documentation for Precast's comic book theme. Colors, typography, spacing, shadows, and animations with copy-to-clipboard functionality."
      />
      <meta
        name="keywords"
        content="design tokens, color palette, typography, spacing scale, CSS variables, comic book colors, design system tokens"
      />

      <meta property="og:title" content="Design Tokens - Colors, Typography & Spacing | Precast" />
      <meta property="og:url" content="https://precast.app/design-system/tokens" />
      <link rel="canonical" href="https://precast.app/design-system/tokens" />
    </Helmet>
  );
}

export function DesignSystemComponentsPageSEO() {
  return (
    <Helmet>
      <title>Component Library - Interactive Examples & Props | Precast Design System</title>
      <meta
        name="description"
        content="Complete component library documentation with live examples, props API, and usage guidelines. Button, Card, and more comic book themed React components."
      />
      <meta
        name="keywords"
        content="React components, component library, UI components, Button component, Card component, props documentation, TypeScript components"
      />

      <meta
        property="og:title"
        content="Component Library - Interactive Examples & Props | Precast"
      />
      <meta property="og:url" content="https://precast.app/design-system/components" />
      <link rel="canonical" href="https://precast.app/design-system/components" />
    </Helmet>
  );
}

export function DesignSystemPlaygroundPageSEO() {
  return (
    <Helmet>
      <title>Interactive Playground - Test Components Live | Precast Design System</title>
      <meta
        name="description"
        content="Interactive component playground for testing Precast's design system components. Configure props, preview changes, and export code in real-time."
      />
      <meta
        name="keywords"
        content="component playground, interactive testing, component configurator, live preview, code generator, design system tools"
      />

      <meta property="og:title" content="Interactive Playground - Test Components Live | Precast" />
      <meta property="og:url" content="https://precast.app/design-system/playground" />
      <link rel="canonical" href="https://precast.app/design-system/playground" />
    </Helmet>
  );
}

export function DesignSystemGuidelinesPageSEO() {
  return (
    <Helmet>
      <title>Design Guidelines - Best Practices & Accessibility | Precast Design System</title>
      <meta
        name="description"
        content="Comprehensive guidelines for using Precast's design system effectively. Accessibility, performance, theming, and component composition best practices."
      />
      <meta
        name="keywords"
        content="design guidelines, accessibility guidelines, component best practices, WCAG compliance, performance optimization, design system guidelines"
      />

      <meta
        property="og:title"
        content="Design Guidelines - Best Practices & Accessibility | Precast"
      />
      <meta property="og:url" content="https://precast.app/design-system/guidelines" />
      <link rel="canonical" href="https://precast.app/design-system/guidelines" />
    </Helmet>
  );
}
