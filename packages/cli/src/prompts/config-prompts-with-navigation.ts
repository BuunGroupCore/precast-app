import { text, select, confirm, multiselect, cancel, isCancel } from "@clack/prompts";
import { consola } from "consola";

import { type ProjectConfig } from "../../../shared/stack-config.js";
import {
  frameworkDefs,
  backendDefs,
  databaseDefs,
  ormDefs,
  stylingDefs,
  runtimeDefs,
} from "../../../shared/stack-config.js";
import type { InitOptions } from "../commands/init.js";
import { getFilteredAuthOptions, isAuthProviderCompatibleWithStack } from "../utils/auth-setup.js";
import { checkCompatibility, UI_LIBRARY_COMPATIBILITY } from "../utils/dependency-checker.js";
import { DEPLOYMENT_CONFIGS } from "../utils/deployment-setup.js";
import { detectAvailablePackageManager } from "../utils/package-manager.js";

import { promptAIAssistant, isValidAIAssistant } from "./ai-assistant.js";
import { promptApiClient } from "./api-client.js";

// Special values for navigation
const GO_BACK = Symbol("GO_BACK");
const EXIT = Symbol("EXIT");

// Prompt state for navigation
interface PromptState {
  name?: string;
  framework?: string;
  backend?: string;
  database?: string;
  orm?: string;
  styling?: string;
  runtime?: string;
  uiLibrary?: string;
  typescript?: boolean;
  git?: boolean;
  docker?: boolean;
  securePasswords?: boolean;
  packageManager?: string;
  authProvider?: string;
  apiClient?: string;
  aiAssistant?: string;
  aiContext?: string[];
  deploymentMethod?: string;
  autoInstall?: boolean;
  mcpServers?: string[];
  powerups?: string[];
}

/**
 * Prompt with back navigation and exit support
 * ESC key or selecting "← Go Back" will return to previous question
 * Selecting "✕ Exit" will exit the CLI
 */
async function promptWithBack<T>(
  message: string,
  options: Array<{ value: T; label: string; hint?: string }>,
  addBackOption = true
): Promise<T | typeof GO_BACK> {
  // Add navigation options at the bottom
  const navigationOptions: Array<{ value: any; label: string; hint?: string }> = [];

  if (addBackOption) {
    navigationOptions.push({
      value: GO_BACK as any,
      label: "← Go Back",
      hint: "Return to previous question",
    });
  }

  // Always add exit option
  navigationOptions.push({
    value: EXIT as any,
    label: "✕ Exit",
    hint: "Exit the CLI (or press CTRL+C)",
  });

  const finalOptions = [...options, ...navigationOptions] as any[];

  const result = await select({
    message,
    options: finalOptions,
  });

  // Check if user cancelled with CTRL+C
  if (isCancel(result)) {
    cancel("Operation cancelled");
    process.exit(0);
  }

  // Check if user selected Exit
  if (result === EXIT) {
    cancel("Operation cancelled by user");
    process.exit(0);
  }

  // Check if user wants to go back (via selecting the option)
  if (result === GO_BACK) {
    return GO_BACK;
  }

  return result as T | typeof GO_BACK;
}

/**
 * Gather project configuration through interactive prompts with back navigation
 * @param projectName - Optional project name
 * @param options - Initial configuration options
 * @returns Complete project configuration
 */
export async function gatherProjectConfigWithNavigation(
  projectName: string | undefined,
  options: InitOptions
): Promise<ProjectConfig> {
  const state: PromptState = {};
  let currentStep = 0;

  // Define the prompt steps
  enum Step {
    NAME,
    FRAMEWORK,
    BACKEND,
    DATABASE,
    ORM,
    STYLING,
    RUNTIME,
    UI_LIBRARY,
    TYPESCRIPT,
    GIT,
    DOCKER,
    AUTH,
    API_CLIENT,
    AI_ASSISTANT,
    DEPLOYMENT,
    INSTALL,
    COMPLETE,
  }

  // Main prompt loop
  while (currentStep !== Step.COMPLETE) {
    try {
      switch (currentStep) {
        case Step.NAME: {
          if (projectName || options.yes) {
            state.name = projectName || "my-awesome-project";
            currentStep++;
          } else {
            const result = await text({
              message: "What is your project name?",
              placeholder: "my-awesome-project",
              defaultValue: state.name || "my-awesome-project",
              validate: (value) => {
                if (!value) return "Project name is required";
                if (!/^[a-z0-9-]+$/.test(value)) {
                  return "Project name must be lowercase and contain only letters, numbers, and hyphens";
                }
              },
            });

            if (isCancel(result)) {
              cancel("Operation cancelled");
              process.exit(0);
            } else {
              state.name = result as string;
              currentStep++;
            }
          }
          break;
        }

        case Step.FRAMEWORK: {
          if (options.framework) {
            state.framework = options.framework;
            currentStep++;
          } else {
            const result = await promptWithBack(
              "Choose your frontend framework:",
              frameworkDefs.map((f) => ({
                value: f.id,
                label: f.name + (state.framework === f.id ? " ✓" : ""),
                hint: f.description,
              })),
              currentStep > 0
            );

            if (result === GO_BACK) {
              currentStep--;
            } else {
              state.framework = result as string;
              currentStep++;
            }
          }
          break;
        }

        case Step.BACKEND: {
          if (options.backend) {
            state.backend = options.backend;
            currentStep++;
          } else {
            const result = await promptWithBack(
              "Choose your backend:",
              backendDefs.map((b) => ({
                value: b.id,
                label: b.name + (state.backend === b.id ? " ✓" : ""),
                hint: b.description,
              }))
            );

            if (result === GO_BACK) {
              currentStep--;
            } else {
              state.backend = result as string;
              currentStep++;
            }
          }
          break;
        }

        case Step.DATABASE: {
          if (state.backend === "none") {
            state.database = "none";
            currentStep++;
          } else if (options.database) {
            state.database = options.database;
            currentStep++;
          } else {
            const result = await promptWithBack(
              "Choose your database:",
              databaseDefs.map((d) => ({
                value: d.id,
                label: d.name + (state.database === d.id ? " ✓" : ""),
                hint: d.description,
              }))
            );

            if (result === GO_BACK) {
              currentStep--;
            } else {
              state.database = result as string;
              currentStep++;
            }
          }
          break;
        }

        case Step.ORM: {
          if (state.database === "none") {
            state.orm = "none";
            currentStep++;
          } else if (options.orm || options.yes) {
            state.orm = options.orm || "none";
            currentStep++;
          } else {
            const result = await promptWithBack(
              "Choose your ORM:",
              ormDefs
                .filter((o) => !o.incompatible?.includes(state.database!))
                .map((o) => ({
                  value: o.id,
                  label: o.name + (state.orm === o.id ? " ✓" : ""),
                  hint: o.description,
                }))
            );

            if (result === GO_BACK) {
              currentStep--;
            } else {
              state.orm = result as string;
              currentStep++;
            }
          }
          break;
        }

        case Step.STYLING: {
          if (options.styling || options.yes) {
            state.styling = options.styling || "css";
            currentStep++;
          } else {
            const result = await promptWithBack(
              "Choose your styling solution:",
              stylingDefs.map((s) => ({
                value: s.id,
                label: s.name + (state.styling === s.id ? " ✓" : ""),
                hint: s.description,
              }))
            );

            if (result === GO_BACK) {
              currentStep--;
            } else {
              state.styling = result as string;
              currentStep++;
            }
          }
          break;
        }

        case Step.RUNTIME: {
          if (options.runtime || options.yes) {
            state.runtime = options.runtime || "node";
            currentStep++;
          } else {
            const result = await promptWithBack(
              "Choose your runtime:",
              runtimeDefs.map((r) => ({
                value: r.id,
                label: r.name + (state.runtime === r.id ? " ✓" : ""),
                hint: r.description,
              }))
            );

            if (result === GO_BACK) {
              currentStep--;
            } else {
              state.runtime = result as string;
              currentStep++;
            }
          }
          break;
        }

        case Step.UI_LIBRARY: {
          if (options.uiLibrary || options.yes) {
            state.uiLibrary = options.uiLibrary || undefined;
            currentStep++;
          } else {
            const compatibleLibraries = Object.entries(UI_LIBRARY_COMPATIBILITY)
              .filter(([lib]) => {
                const { compatible } = checkCompatibility(
                  state.framework!,
                  lib,
                  UI_LIBRARY_COMPATIBILITY
                );
                return compatible;
              })
              .map(([lib]) => lib);

            if (compatibleLibraries.length > 0) {
              const result = await promptWithBack("Choose a UI component library (optional):", [
                { value: "none", label: "None", hint: "Set up UI library later" },
                ...compatibleLibraries.map((lib) => ({
                  value: lib,
                  label:
                    (lib === "shadcn" ? "shadcn/ui" : lib === "daisyui" ? "DaisyUI" : lib) +
                    (state.uiLibrary === lib ? " ✓" : ""),
                  hint:
                    lib === "shadcn"
                      ? "Copy-paste components with full control"
                      : lib === "daisyui"
                        ? "Semantic component classes"
                        : undefined,
                })),
              ]);

              if (result === GO_BACK) {
                currentStep--;
              } else {
                state.uiLibrary = result === "none" ? undefined : (result as string);
                currentStep++;
              }
            } else {
              currentStep++;
            }
          }
          break;
        }

        case Step.TYPESCRIPT: {
          if (options.typescript !== undefined || options.yes) {
            state.typescript = options.typescript !== false;
            currentStep++;
          } else {
            const confirmMessage =
              state.typescript !== undefined
                ? `Use TypeScript? (currently: ${state.typescript ? "Yes" : "No"})`
                : "Use TypeScript?";

            const result = await confirm({
              message: confirmMessage,
              initialValue: state.typescript !== undefined ? state.typescript : true,
            });

            if (isCancel(result)) {
              cancel("Operation cancelled");
              process.exit(0);
            } else {
              state.typescript = result as boolean;
              currentStep++;
            }
          }
          break;
        }

        case Step.GIT: {
          if (options.git !== undefined || options.yes) {
            state.git = options.git !== false;
            currentStep++;
          } else {
            const confirmMessage =
              state.git !== undefined
                ? `Initialize git repository? (currently: ${state.git ? "Yes" : "No"})`
                : "Initialize git repository?";

            const result = await confirm({
              message: confirmMessage,
              initialValue: state.git !== undefined ? state.git : true,
            });

            if (isCancel(result)) {
              cancel("Operation cancelled");
              process.exit(0);
            } else {
              state.git = result as boolean;
              currentStep++;
            }
          }
          break;
        }

        case Step.DOCKER: {
          if (options.docker !== undefined || options.yes) {
            state.docker = options.docker === true;
            currentStep++;
          } else {
            const confirmMessage =
              state.docker !== undefined
                ? `Include Docker configuration? (currently: ${state.docker ? "Yes" : "No"})`
                : "Include Docker configuration?";

            const result = await confirm({
              message: confirmMessage,
              initialValue: state.docker !== undefined ? state.docker : false,
            });

            if (isCancel(result)) {
              cancel("Operation cancelled");
              process.exit(0);
            } else {
              state.docker = result as boolean;

              // If Docker is enabled, ask about secure passwords
              if (state.docker) {
                if (options.securePasswords !== undefined) {
                  state.securePasswords = options.securePasswords;
                } else if (!options.yes) {
                  const secureResult = await confirm({
                    message: "Use secure random passwords for Docker databases?",
                    initialValue: true,
                  });

                  if (isCancel(secureResult)) {
                    cancel("Operation cancelled");
                    process.exit(0);
                  }

                  state.securePasswords = secureResult as boolean;
                }
              }

              currentStep++;
            }
          }
          break;
        }

        case Step.AUTH: {
          // Check if auth is even possible with the selected stack
          if (state.backend === "none" || state.database === "none") {
            if (options.auth && options.auth !== "none") {
              consola.warn(
                `⚠️  Authentication requires both a backend server and database for security.`
              );
              consola.warn(`   Selected backend: ${state.backend}, database: ${state.database}`);
            }
            state.authProvider = undefined;
            currentStep++;
          } else if (options.auth) {
            const stackConfig = {
              framework: state.framework!,
              backend: state.backend!,
              database: state.database!,
            };
            if (isAuthProviderCompatibleWithStack(options.auth, stackConfig)) {
              state.authProvider = options.auth;
            }
            currentStep++;
          } else if (!options.yes) {
            const stackConfig = {
              framework: state.framework!,
              backend: state.backend!,
              database: state.database!,
              orm: state.orm,
            };
            const authOptions = getFilteredAuthOptions(stackConfig);

            if (authOptions.length > 0) {
              const result = await promptWithBack("Choose authentication provider (optional):", [
                { value: "none", label: "None", hint: "Set up authentication later" },
                ...authOptions.map((opt) => ({
                  ...opt,
                  label: opt.label + (state.authProvider === opt.value ? " ✓" : ""),
                })),
              ]);

              if (result === GO_BACK) {
                currentStep--;
              } else {
                state.authProvider = result === "none" ? undefined : (result as string);
                currentStep++;
              }
            } else {
              consola.info("ℹ️  No compatible authentication providers for your selected stack.");
              currentStep++;
            }
          } else {
            currentStep++;
          }
          break;
        }

        case Step.API_CLIENT: {
          if (options.apiClient) {
            state.apiClient = options.apiClient;
            currentStep++;
          } else if (!options.yes && state.backend !== "none") {
            // Use existing promptApiClient but handle back navigation
            const savedApiClient = state.apiClient;
            state.apiClient = await promptApiClient({
              framework: state.framework!,
              backend: state.backend!,
            });

            // Check if user cancelled (promptApiClient might return undefined)
            if (state.apiClient === undefined && savedApiClient !== undefined) {
              state.apiClient = savedApiClient;
              currentStep--;
            } else {
              currentStep++;
            }
          } else {
            currentStep++;
          }
          break;
        }

        case Step.AI_ASSISTANT: {
          if (options.ai) {
            state.aiAssistant = isValidAIAssistant(options.ai) ? options.ai : undefined;
            currentStep++;
          } else if (!options.yes) {
            const savedAI = state.aiAssistant;
            const result = await promptAIAssistant({ framework: state.framework! });

            if (result === undefined && savedAI !== undefined) {
              state.aiAssistant = savedAI;
              currentStep--;
            } else {
              state.aiAssistant = result;
              state.mcpServers = options.mcpServers;
              currentStep++;
            }
          } else {
            currentStep++;
          }
          break;
        }

        case Step.DEPLOYMENT: {
          if (options.yes) {
            currentStep++;
          } else {
            const deploymentOptions = Object.values(DEPLOYMENT_CONFIGS).map((config) => ({
              value: config.id,
              label: config.name + (state.deploymentMethod === config.id ? " ✓" : ""),
              hint: config.description,
            }));

            const result = await promptWithBack("Choose deployment method (optional):", [
              { value: "none", label: "None", hint: "Set up deployment later" },
              ...deploymentOptions,
            ]);

            if (result === GO_BACK) {
              currentStep--;
            } else {
              state.deploymentMethod = result === "none" ? undefined : (result as string);
              currentStep++;
            }
          }
          break;
        }

        case Step.INSTALL: {
          if (options.install !== undefined || options.yes) {
            state.autoInstall = options.install === true;
            state.packageManager =
              options.packageManager || (await detectAvailablePackageManager());
            currentStep++;
          } else {
            const confirmMessage =
              state.autoInstall !== undefined
                ? `Install dependencies? (currently: ${state.autoInstall ? "Yes" : "No"})`
                : "Install dependencies?";

            const result = await confirm({
              message: confirmMessage,
              initialValue: state.autoInstall !== undefined ? state.autoInstall : true,
            });

            if (isCancel(result)) {
              cancel("Operation cancelled");
              process.exit(0);
            } else {
              state.autoInstall = result as boolean;
              state.packageManager =
                options.packageManager || (await detectAvailablePackageManager());
              currentStep++;
            }
          }
          break;
        }

        default:
          currentStep = Step.COMPLETE;
      }
    } catch (error) {
      // Handle any unexpected errors
      consola.error("An error occurred:", error);
      currentStep--;
    }
  }

  // Build final configuration
  return {
    name: state.name!,
    framework: state.framework!,
    backend: state.backend!,
    database: state.database!,
    orm: state.orm!,
    styling: state.styling!,
    runtime: state.runtime || "node",
    typescript: state.typescript !== false,
    git: state.git !== false,
    gitignore: options.gitignore !== undefined ? options.gitignore : true,
    eslint: options.eslint !== undefined ? options.eslint : true,
    prettier: options.prettier !== undefined ? options.prettier : true,
    docker: state.docker === true,
    securePasswords: state.securePasswords,
    uiLibrary: state.uiLibrary,
    aiContext: state.aiContext,
    aiAssistant: state.aiAssistant,
    packageManager: state.packageManager || "bun",
    deploymentMethod: state.deploymentMethod,
    authProvider: state.authProvider,
    apiClient: state.apiClient,
    autoInstall: state.autoInstall === true,
    generate: options.generate !== undefined ? options.generate : true,
    projectPath: "",
    language: state.typescript !== false ? "typescript" : "javascript",
    mcpServers: state.mcpServers || options.mcpServers,
    powerups: state.powerups || options.powerups,
  };
}
