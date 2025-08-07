import type { FileNode } from "@/components/builder/types";

interface FrameworkFiles {
  src: FileNode[];
  public?: FileNode[];
}

/**
 * Returns framework-specific file structure for project scaffolding.
 * Provides different file structures based on the selected framework and TypeScript preference.
 *
 * @param framework - The framework identifier (react, vue, angular, etc.)
 * @param typescript - Whether to include TypeScript file extensions
 * @returns Object containing src and public file structures
 */
export function getFrameworkFiles(framework: string, typescript: boolean): FrameworkFiles {
  switch (framework) {
    case "react":
    case "vite":
      return {
        src: [
          { name: "components", type: "folder", children: [] },
          {
            name: typescript ? "main.tsx" : "main.jsx",
            type: "file",
            previewContent: "main.tsx",
          },
          {
            name: typescript ? "App.tsx" : "App.jsx",
            type: "file",
            previewContent: "App.tsx",
          },
          {
            name: "index.css",
            type: "file",
            previewContent: "index.css",
          },
        ],
        public: [
          {
            name: "index.html",
            type: "file",
            previewContent: "index.html",
          },
        ],
      };

    case "vue":
      return {
        src: [
          { name: "components", type: "folder", children: [] },
          {
            name: typescript ? "main.ts" : "main.js",
            type: "file",
            previewContent: "main.vue",
          },
          {
            name: "App.vue",
            type: "file",
            previewContent: "App.vue",
          },
          {
            name: "style.css",
            type: "file",
            previewContent: "style.css",
          },
        ],
        public: [
          {
            name: "index.html",
            type: "file",
            previewContent: "index.html",
          },
        ],
      };

    case "angular":
      return {
        src: [
          {
            name: "app",
            type: "folder",
            children: [
              {
                name: "components",
                type: "folder",
                children: [
                  {
                    name: "counter",
                    type: "folder",
                    children: [
                      { name: "counter.component.ts", type: "file" },
                      { name: "counter.component.html", type: "file" },
                    ],
                  },
                  {
                    name: "hello-world",
                    type: "folder",
                    children: [
                      { name: "hello-world.component.ts", type: "file" },
                      { name: "hello-world.component.html", type: "file" },
                    ],
                  },
                ],
              },
              { name: "app.component.ts", type: "file", previewContent: "app.component.ts" },
              { name: "app.component.html", type: "file", previewContent: "app.component.html" },
              { name: "app.config.ts", type: "file" },
              { name: "app.routes.ts", type: "file" },
            ],
          },
          {
            name: "main.ts",
            type: "file",
            previewContent: "main.ts",
          },
          {
            name: "index.html",
            type: "file",
            previewContent: "index.html",
          },
          {
            name: "styles.css",
            type: "file",
            previewContent: "styles.css",
          },
        ],
      };

    case "next":
      return {
        src: [
          {
            name: "app",
            type: "folder",
            children: [
              {
                name: typescript ? "layout.tsx" : "layout.jsx",
                type: "file",
                previewContent: "layout.tsx",
              },
              {
                name: typescript ? "page.tsx" : "page.jsx",
                type: "file",
                previewContent: "page.tsx",
              },
              {
                name: "globals.css",
                type: "file",
                previewContent: "globals.css",
              },
            ],
          },
          {
            name: "components",
            type: "folder",
            children: [],
          },
        ],
        public: [],
      };

    case "nuxt":
      return {
        src: [
          {
            name: "pages",
            type: "folder",
            children: [{ name: "index.vue", type: "file", previewContent: "index.vue" }],
          },
          {
            name: "components",
            type: "folder",
            children: [],
          },
          {
            name: "app.vue",
            type: "file",
            previewContent: "app.vue",
          },
        ],
      };

    case "svelte":
      return {
        src: [
          {
            name: "lib",
            type: "folder",
            children: [
              {
                name: "components",
                type: "folder",
                children: [],
              },
            ],
          },
          {
            name: "routes",
            type: "folder",
            children: [
              { name: "+page.svelte", type: "file", previewContent: "+page.svelte" },
              { name: "+layout.svelte", type: "file", previewContent: "+layout.svelte" },
            ],
          },
          {
            name: "app.html",
            type: "file",
            previewContent: "app.html",
          },
        ],
      };

    case "solid":
      return {
        src: [
          { name: "components", type: "folder", children: [] },
          {
            name: typescript ? "index.tsx" : "index.jsx",
            type: "file",
            previewContent: "index.tsx",
          },
          {
            name: typescript ? "App.tsx" : "App.jsx",
            type: "file",
            previewContent: "App.tsx",
          },
        ],
        public: [
          {
            name: "index.html",
            type: "file",
            previewContent: "index.html",
          },
        ],
      };

    case "remix":
      return {
        src: [
          {
            name: "app",
            type: "folder",
            children: [
              {
                name: "routes",
                type: "folder",
                children: [{ name: typescript ? "_index.tsx" : "_index.jsx", type: "file" }],
              },
              { name: typescript ? "root.tsx" : "root.jsx", type: "file" },
              { name: typescript ? "entry.client.tsx" : "entry.client.jsx", type: "file" },
              { name: typescript ? "entry.server.tsx" : "entry.server.jsx", type: "file" },
            ],
          },
        ],
        public: [],
      };

    case "astro":
      return {
        src: [
          {
            name: "pages",
            type: "folder",
            children: [{ name: "index.astro", type: "file", previewContent: "index.astro" }],
          },
          {
            name: "components",
            type: "folder",
            children: [],
          },
          {
            name: "layouts",
            type: "folder",
            children: [{ name: "Layout.astro", type: "file", previewContent: "Layout.astro" }],
          },
        ],
        public: [],
      };

    default:
      // Vanilla JS
      return {
        src: [
          {
            name: "main.js",
            type: "file",
            previewContent: "main.js",
          },
          {
            name: "style.css",
            type: "file",
            previewContent: "style.css",
          },
        ],
        public: [
          {
            name: "index.html",
            type: "file",
            previewContent: "index.html",
          },
        ],
      };
  }
}
