import { Dexie, Table } from "dexie";

/**
 * Saved project configuration stored in the local database.
 * Contains complete stack selection and metadata for persistence.
 */
export interface SavedProject {
  id?: number;
  name: string;
  framework: string;
  backend: string;
  database: string;
  orm: string;
  styling: string;
  typescript: boolean;
  git: boolean;
  docker: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User preferences and default settings for the project builder.
 * Stores preferred technology choices and configuration defaults.
 */
export interface UserSettings {
  id?: number;
  preferredFramework?: string;
  preferredUIFramework?: string;
  preferredBackend?: string;
  preferredDatabase?: string;
  preferredOrm?: string;
  preferredStyling?: string;
  preferredRuntime?: string;
  preferredAuth?: string;
  preferredUILibrary?: string;
  preferredPackageManager?: string;
  preferredDeployment?: string;
  defaultTypescript?: boolean;
  defaultGit?: boolean;
  defaultDocker?: boolean;
  defaultAutoInstall?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Local database for storing user projects and settings.
 * Uses IndexedDB through Dexie for client-side persistence.
 */
export class PrecastDatabase extends Dexie {
  savedProjects!: Table<SavedProject>;
  userSettings!: Table<UserSettings>;

  constructor() {
    super("PrecastDB");
    this.version(1).stores({
      savedProjects: "++id, name, createdAt, updatedAt",
    });
    this.version(2).stores({
      savedProjects: "++id, name, createdAt, updatedAt",
      userSettings: "++id, createdAt, updatedAt",
    });
  }
}

export const db = new PrecastDatabase();
