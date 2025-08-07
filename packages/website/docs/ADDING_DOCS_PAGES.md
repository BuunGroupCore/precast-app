# Adding New Documentation Pages

This guide explains how to add new documentation pages to the Precast website.

## Overview

The documentation system uses a modular component-based approach with the following structure:

- **DocsPage.tsx**: Main documentation page with sidebar navigation and table of contents
- **Documentation Components**: Individual components for each documentation section
- **Dynamic Routing**: Content is rendered based on the active section

## Step-by-Step Guide

### 1. Create a New Documentation Component

Create a new component in `/packages/website/src/components/docs/`:

```tsx
// Example: /packages/website/src/components/docs/YourNewDocs.tsx
import { CodeBlock } from "../CodeBlock";

export function YourNewDocs() {
  return (
    <div className="space-y-8">
      <section id="section-1" className="comic-panel p-6">
        <h2 className="font-display text-2xl text-comic-blue mb-4">Section Title</h2>
        <p className="font-comic mb-4">Your documentation content here...</p>

        {/* Use CodeBlock for code examples */}
        <CodeBlock code="$ your-command-here" />
      </section>

      <section id="section-2" className="comic-panel p-6">
        <h2 className="font-display text-2xl text-comic-green mb-4">Another Section</h2>
        <p className="font-comic">More content...</p>
      </section>
    </div>
  );
}
```

### 2. Add Navigation Entry

Update the `docSections` array in `/packages/website/src/pages/DocsPage.tsx`:

```tsx
const docSections: DocSection[] = [
  // ... existing sections
  {
    id: "your-new-section",
    title: "Your New Section",
    icon: FaYourIcon, // Import the icon from react-icons
    subsections: [
      { id: "subsection-1", title: "Subsection 1" },
      { id: "subsection-2", title: "Subsection 2" },
    ],
  },
];
```

### 3. Import and Add Dynamic Rendering

In `/packages/website/src/pages/DocsPage.tsx`:

```tsx
// Add import at the top
import { YourNewDocs } from "../components/docs/YourNewDocs";

// Add rendering condition in the content area
{
  activeSection === "your-new-section" && <YourNewDocs />;
}
```

### 4. Add Table of Contents

Update the table of contents section in DocsPage.tsx:

```tsx
{
  activeSection === "your-new-section" && (
    <>
      <button
        onClick={() => scrollToSection("section-1")}
        className={`w-full text-left font-comic text-sm transition-all py-2 px-3 rounded-lg border-2 ${
          activeTocItem === "section-1"
            ? "bg-comic-yellow text-comic-black border-comic-black shadow-comic"
            : "text-comic-black hover:bg-comic-yellow/20 border-transparent"
        }`}
      >
        Section 1
      </button>
      <button
        onClick={() => scrollToSection("section-2")}
        className={`w-full text-left font-comic text-sm transition-all py-2 px-3 rounded-lg border-2 ${
          activeTocItem === "section-2"
            ? "bg-comic-yellow text-comic-black border-comic-black shadow-comic"
            : "text-comic-black hover:bg-comic-yellow/20 border-transparent"
        }`}
      >
        Section 2
      </button>
    </>
  );
}
```

### 5. Update Sitemap (Optional)

If the section should be indexed, add it to `/packages/website/public/sitemap.xml`:

```xml
<url>
  <loc>https://precast.dev/docs/your-new-section</loc>
  <lastmod>2025-01-04</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

## Component Guidelines

### Using CodeBlock Component

The `CodeBlock` component provides copy-to-clipboard functionality:

```tsx
// Basic usage
<CodeBlock code="$ npm install" />

// Multi-line code
<CodeBlock
  code={`$ cd my-project
$ npm install
$ npm run dev`}
/>

// With line numbers
<CodeBlock
  code="const hello = 'world';"
  language="javascript"
  showLineNumbers={true}
/>
```

### Styling Guidelines

Use the comic book theme classes:

- **Panels**: `comic-panel p-6`
- **Headers**: `font-display text-2xl text-comic-[color]`
- **Text**: `font-comic`
- **Code blocks**: Use the `CodeBlock` component
- **Highlights**: `bg-comic-yellow/20 p-4 rounded-lg border-2 border-comic-black`

### Color Palette

- `text-comic-red`: Red text
- `text-comic-blue`: Blue text
- `text-comic-green`: Green text
- `text-comic-purple`: Purple text
- `text-comic-yellow`: Yellow text
- `text-comic-orange`: Orange text
- `text-comic-black`: Black text
- `text-comic-white`: White text

## Best Practices

1. **Section IDs**: Always add unique `id` attributes to sections for table of contents navigation
2. **Consistent Styling**: Follow the existing comic book theme
3. **Code Examples**: Use the `CodeBlock` component for all code snippets
4. **Mobile Responsiveness**: Test your documentation on different screen sizes
5. **SEO**: Add meaningful titles and descriptions to sections

## Example: Adding API Documentation

Here's a complete example of adding API documentation:

```tsx
// 1. Create /packages/website/src/components/docs/ApiDocs.tsx
import { CodeBlock } from "../CodeBlock";

export function ApiDocs() {
  return (
    <div className="space-y-8">
      <section id="api-overview" className="comic-panel p-6">
        <h2 className="font-display text-2xl text-comic-blue mb-4">
          API Overview
        </h2>
        <p className="font-comic mb-4">
          The Precast API allows you to programmatically create and manage projects.
        </p>
        <CodeBlock
          code={`import { createProject } from '@precast/api';

const project = await createProject({
  name: 'my-app',
  framework: 'react',
  typescript: true
});`}
          language="javascript"
        />
      </section>
    </div>
  );
}

// 2. Add to docSections in DocsPage.tsx
{
  id: "api",
  title: "API Reference",
  icon: FaCode,
  subsections: [
    { id: "api-overview", title: "Overview" },
    { id: "api-methods", title: "Methods" },
  ],
}

// 3. Import and render
import { ApiDocs } from "../components/docs/ApiDocs";
{activeSection === "api" && <ApiDocs />}
```

## Troubleshooting

- **Navigation not working**: Ensure the section ID matches exactly in `docSections` and the rendering condition
- **TOC not scrolling**: Check that section IDs in the HTML match the `scrollToSection` calls
- **Styling issues**: Verify you're using the correct comic book theme classes

For more help, check the existing documentation components as examples.
