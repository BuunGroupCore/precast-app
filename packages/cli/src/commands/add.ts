import path from "path";

import { text, select, confirm } from "@clack/prompts";
import { consola } from "consola";
import fsExtra from "fs-extra";

import { trackFeatureAdded } from "../utils/analytics.js";
// eslint-disable-next-line import/no-named-as-default-member
const { ensureDir, writeFile, pathExists, readJSON } = fsExtra;
interface AddOptions {
  type?: string;
  name?: string;
  typescript?: boolean;
}

/**
 * Add a new resource to the project (component, route, API endpoint, etc.)
 * @param resource - Type of resource to add
 * @param options - Options for resource generation
 */
export async function addCommand(resource: string | undefined, options: AddOptions) {
  const resourceType =
    resource ||
    ((await select({
      message: "What would you like to add?",
      options: [
        { value: "component", label: "Component", hint: "Add a new React/Vue/Svelte component" },
        { value: "route", label: "Route", hint: "Add a new route/page" },
        { value: "api", label: "API Endpoint", hint: "Add a new API endpoint" },
        { value: "hook", label: "Custom Hook", hint: "Add a custom React hook" },
        { value: "util", label: "Utility Function", hint: "Add a utility function" },
      ],
    })) as string);
  switch (resourceType) {
    case "component":
      await addComponent(options);
      break;
    case "route":
      await addRoute(options);
      break;
    case "api":
      await addApiEndpoint(options);
      break;
    case "hook":
      await addHook(options);
      break;
    case "util":
      await addUtility(options);
      break;
    default:
      consola.error(`Unknown resource type: ${resourceType}`);
  }
}

/**
 * Add a new component to the project
 * @param options - Component generation options
 */
async function addComponent(options: AddOptions) {
  const name =
    options.name ||
    ((await text({
      message: "Component name:",
      placeholder: "Button",
      validate: (value) => {
        if (!value) return "Component name is required";
        if (!/^[A-Z][a-zA-Z0-9]*$/.test(value)) {
          return "Component name must start with uppercase and be alphanumeric";
        }
      },
    })) as string);
  const framework = await detectFramework();
  const useTypeScript = options.typescript ?? (await detectTypeScript());
  const withStyles = await confirm({
    message: "Include styles?",
    initialValue: true,
  });
  if (typeof withStyles === "symbol") return;

  const withTests = await confirm({
    message: "Include test file?",
    initialValue: true,
  });
  if (typeof withTests === "symbol") return;

  const withStorybook = await confirm({
    message: "Include Storybook story?",
    initialValue: false,
  });
  if (typeof withStorybook === "symbol") return;
  switch (framework) {
    case "react":
    case "next":
      await generateReactComponent(name, {
        typescript: useTypeScript,
        withStyles,
        withTests,
        withStorybook,
      });
      break;
    case "vue":
    case "nuxt":
      await generateVueComponent(name, {
        typescript: useTypeScript,
        withStyles,
        withTests,
        withStorybook,
      });
      break;
    case "svelte":
      await generateSvelteComponent(name, {
        typescript: useTypeScript,
        withStyles,
        withTests,
        withStorybook,
      });
      break;
    default:
      consola.error(`Unsupported framework: ${framework}`);
  }
}

/**
 * Generate a React component with optional features
 * @param name - Component name
 * @param options - Component generation options
 */
async function generateReactComponent(
  name: string,
  options: {
    typescript: boolean;
    withStyles: boolean;
    withTests: boolean;
    withStorybook: boolean;
  }
) {
  const ext = options.typescript ? "tsx" : "jsx";
  const componentDir = path.join(process.cwd(), "src/components", name);
  await ensureDir(componentDir);
  const componentContent = `${
    options.typescript
      ? `interface ${name}Props {
  className?: string;
  children?: React.ReactNode;
}
`
      : ""
  }export default function ${name}(${options.typescript ? `{ className, children }: ${name}Props` : "props"}) {
  return (
    <div className={\`${name.toLowerCase()} \${${options.typescript ? "className" : "props.className"} || ''}\`}>
      ${options.typescript ? "{children}" : "{props.children}"}
    </div>
  );
}`;
  await writeFile(path.join(componentDir, `${name}.${ext}`), componentContent);
  if (options.withStyles) {
    const stylesContent = `.${name.toLowerCase()} {
}`;
    await writeFile(path.join(componentDir, `${name}.module.css`), stylesContent);
  }
  if (options.withTests) {
    const testContent = `import { render, screen } from '@testing-library/react';
import ${name} from './${name}';
describe('${name}', () => {
  it('renders without crashing', () => {
    render(<${name} />);
    expect(screen.getByText('${name}')).toBeInTheDocument();
  });
});`;
    await writeFile(path.join(componentDir, `${name}.test.${ext}`), testContent);
  }
  if (options.withStorybook) {
    const storyContent = `import type { Meta, StoryObj } from '@storybook/react';
import ${name} from './${name}';
const meta: Meta<typeof ${name}> = {
  title: 'Components/${name}',
  component: ${name},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {},
};`;
    await writeFile(path.join(componentDir, `${name}.stories.${ext}`), storyContent);
  }
  await writeFile(
    path.join(componentDir, `index.${options.typescript ? "ts" : "js"}`),
    `export { default } from './${name}';`
  );

  await trackFeatureAdded("component", {
    component_name: name,
    framework: "react",
    typescript: options.typescript,
    with_styles: options.withStyles,
    with_tests: options.withTests,
    with_storybook: options.withStorybook,
  });

  consola.success(`Component ${name} created successfully!`);
  consola.info(`Location: ${componentDir}`);
}

/**
 * Generate a Vue component (not yet implemented)
 * @param _name - Component name
 * @param _options - Component generation options
 */
async function generateVueComponent(_name: string, _options: any) {
  consola.info("Vue component generation coming soon!");
}

/**
 * Generate a Svelte component (not yet implemented)
 * @param _name - Component name
 * @param _options - Component generation options
 */
async function generateSvelteComponent(_name: string, _options: any) {
  consola.info("Svelte component generation coming soon!");
}

/**
 * Add a new route to the project (not yet implemented)
 * @param _options - Route generation options
 */
async function addRoute(_options: AddOptions) {
  consola.info("Route generation coming soon!");
}

/**
 * Add a new API endpoint (not yet implemented)
 * @param _options - API endpoint generation options
 */
async function addApiEndpoint(_options: AddOptions) {
  consola.info("API endpoint generation coming soon!");
}

/**
 * Add a new React hook (not yet implemented)
 * @param _options - Hook generation options
 */
async function addHook(_options: AddOptions) {
  consola.info("Hook generation coming soon!");
}

/**
 * Add a new utility function (not yet implemented)
 * @param _options - Utility generation options
 */
async function addUtility(_options: AddOptions) {
  consola.info("Utility generation coming soon!");
}

/**
 * Detect the framework used in the current project
 * @returns Framework name
 */
async function detectFramework(): Promise<string> {
  const packageJsonPath = path.join(process.cwd(), "package.json");
  if (await pathExists(packageJsonPath)) {
    const packageJson = await readJSON(packageJsonPath);
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    if (deps.next) return "next";
    if (deps.react) return "react";
    if (deps.vue) return "vue";
    if (deps.nuxt) return "nuxt";
    if (deps.svelte) return "svelte";
  }
  return "react";
}

/**
 * Detect if the project uses TypeScript
 * @returns True if TypeScript is configured
 */
async function detectTypeScript(): Promise<boolean> {
  return await pathExists(path.join(process.cwd(), "tsconfig.json"));
}
