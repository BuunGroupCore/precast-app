import path from "path";
import fs from "fs-extra";
import { type ProjectConfig } from "../../../shared/stack-config.js";

export async function generateReactTemplate(
  config: ProjectConfig,
  projectPath: string,
) {
  // Create directory structure
  const dirs = [
    "src",
    "src/components",
    "src/pages",
    "src/hooks",
    "src/utils",
    "src/styles",
    "public",
  ];

  if (config.backend !== "none") {
    dirs.push("src/api", "src/services");
  }

  for (const dir of dirs) {
    await fs.ensureDir(path.join(projectPath, dir));
  }

  // Generate package.json
  const packageJson = generatePackageJson(config);
  await fs.writeJSON(path.join(projectPath, "package.json"), packageJson, {
    spaces: 2,
  });

  // Generate vite.config
  const viteConfig = generateViteConfig(config);
  await fs.writeFile(
    path.join(
      projectPath,
      config.typescript ? "vite.config.ts" : "vite.config.js",
    ),
    viteConfig,
  );

  // Generate tsconfig if TypeScript
  if (config.typescript) {
    const tsconfig = generateTsConfig();
    await fs.writeJSON(path.join(projectPath, "tsconfig.json"), tsconfig, {
      spaces: 2,
    });
  }

  // Generate index.html
  const indexHtml = generateIndexHtml(config);
  await fs.writeFile(path.join(projectPath, "index.html"), indexHtml);

  // Generate main entry file
  const mainFile = generateMainFile(config);
  await fs.writeFile(
    path.join(projectPath, "src", config.typescript ? "main.tsx" : "main.jsx"),
    mainFile,
  );

  // Generate App component
  const appFile = generateAppFile(config);
  await fs.writeFile(
    path.join(projectPath, "src", config.typescript ? "App.tsx" : "App.jsx"),
    appFile,
  );

  // Generate styles
  await generateStyles(config, projectPath);
}

function generatePackageJson(config: ProjectConfig) {
  const deps: Record<string, string> = {
    react: "^18.2.0",
    "react-dom": "^18.2.0",
  };

  const devDeps: Record<string, string> = {
    "@vitejs/plugin-react": "^4.2.1",
    vite: "^5.0.8",
  };

  // Add TypeScript dependencies
  if (config.typescript) {
    devDeps["@types/react"] = "^18.2.43";
    devDeps["@types/react-dom"] = "^18.2.17";
    devDeps["typescript"] = "^5.3.3";
  }

  // Add styling dependencies
  if (config.styling === "tailwind") {
    devDeps["tailwindcss"] = "^3.3.0";
    devDeps["postcss"] = "^8.4.32";
    devDeps["autoprefixer"] = "^10.4.16";
  } else if (config.styling === "scss") {
    devDeps["sass"] = "^1.69.5";
  } else if (config.styling === "styled-components") {
    deps["styled-components"] = "^6.1.1";
    if (config.typescript) {
      devDeps["@types/styled-components"] = "^5.1.34";
    }
  }

  // Add backend/API dependencies
  if (config.backend !== "none") {
    deps["axios"] = "^1.6.2";
    deps["react-query"] = "^3.39.3";
  }

  // Add database/ORM dependencies
  if (config.orm === "prisma") {
    devDeps["prisma"] = "^5.7.0";
    deps["@prisma/client"] = "^5.7.0";
  }

  return {
    name: config.name,
    private: true,
    version: "0.0.0",
    type: "module",
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview",
      ...(config.typescript ? { "type-check": "tsc --noEmit" } : {}),
      ...(config.orm === "prisma"
        ? {
            "db:generate": "prisma generate",
            "db:migrate": "prisma migrate dev",
            "db:push": "prisma db push",
            "db:studio": "prisma studio",
          }
        : {}),
    },
    dependencies: deps,
    devDependencies: devDeps,
  };
}

function generateViteConfig(config: ProjectConfig) {
  const imports = [
    "import { defineConfig } from 'vite'",
    "import react from '@vitejs/plugin-react'",
  ];
  const plugins = ["react()"];

  return `${imports.join("\n")}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [${plugins.join(", ")}],
  server: {
    port: 3000,
  },
})
`;
}

function generateTsConfig() {
  return {
    compilerOptions: {
      target: "ES2020",
      useDefineForClassFields: true,
      lib: ["ES2020", "DOM", "DOM.Iterable"],
      module: "ESNext",
      skipLibCheck: true,
      moduleResolution: "bundler",
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: "react-jsx",
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
    },
    include: ["src"],
    references: [{ path: "./tsconfig.node.json" }],
  };
}

function generateIndexHtml(config: ProjectConfig) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.${config.typescript ? "tsx" : "jsx"}"></script>
  </body>
</html>
`;
}

function generateMainFile(config: ProjectConfig) {
  const ext = config.typescript ? "tsx" : "jsx";
  const imports = [
    "import React from 'react'",
    "import ReactDOM from 'react-dom/client'",
    "import App from './App'",
  ];

  if (config.styling === "tailwind" || config.styling === "css") {
    imports.push("import './index.css'");
  } else if (config.styling === "scss") {
    imports.push("import './index.scss'");
  }

  return `${imports.join("\n")}

ReactDOM.createRoot(document.getElementById('root')${config.typescript ? "!" : ""}).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;
}

function generateAppFile(config: ProjectConfig) {
  const content = config.typescript
    ? `import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>${config.name}</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
`
    : `import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>${config.name}</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
`;

  return content;
}

async function generateStyles(config: ProjectConfig, projectPath: string) {
  if (config.styling === "tailwind") {
    // Generate Tailwind CSS config
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
    await fs.writeFile(
      path.join(projectPath, "tailwind.config.js"),
      tailwindConfig,
    );

    // Generate PostCSS config
    const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;
    await fs.writeFile(
      path.join(projectPath, "postcss.config.js"),
      postcssConfig,
    );

    // Generate index.css with Tailwind directives
    const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;
    await fs.writeFile(path.join(projectPath, "src", "index.css"), indexCss);
  } else if (config.styling === "css") {
    // Generate basic CSS
    const indexCss = `:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

.App {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}
`;
    await fs.writeFile(path.join(projectPath, "src", "index.css"), indexCss);
  } else if (config.styling === "scss") {
    // Generate SCSS
    const indexScss = `$primary-color: #646cff;
$bg-dark: #242424;
$bg-light: #ffffff;

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: $bg-dark;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: 500;
  color: $primary-color;
  text-decoration: inherit;
  
  &:hover {
    color: lighten($primary-color, 10%);
  }
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

.App {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: $bg-light;
  }
}
`;
    await fs.writeFile(path.join(projectPath, "src", "index.scss"), indexScss);
  }
}
