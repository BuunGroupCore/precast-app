import Dexie, { Table } from "dexie";

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

export interface UserSettings {
  id?: number;
  // Preferred defaults
  preferredFramework?: string;
  preferredBackend?: string;
  preferredDatabase?: string;
  preferredOrm?: string;
  preferredStyling?: string;
  preferredRuntime?: string;
  preferredAuth?: string;
  preferredUILibrary?: string;
  preferredPackageManager?: string;
  preferredDeployment?: string;
  // Default toggles
  defaultTypescript?: boolean;
  defaultGit?: boolean;
  defaultDocker?: boolean;
  defaultAutoInstall?: boolean;
  // Meta
  createdAt: Date;
  updatedAt: Date;
}

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
