import { consola } from "consola";

interface AddOptions {
  type?: string;
  name?: string;
  typescript?: boolean;
  ui?: string;
  auth?: string;
  apiClient?: string;
  ai?: string;
  plugin?: string;
}

/**
 * Add a new resource to the project (component, route, API endpoint, etc.)
 * This command is currently under development and will be completely rewritten.
 * @param resource - Type of resource to add
 * @param options - Options for resource generation
 */
export async function addCommand(_resource: string | undefined, _options: AddOptions) {
  consola.info("The 'add' command is currently under development.");
  consola.info("This feature will be available in a future release.");
  consola.info("Stay tuned for updates!");
}
