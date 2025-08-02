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

export class PrecastDatabase extends Dexie {
  savedProjects!: Table<SavedProject>;

  constructor() {
    super("PrecastDB");
    this.version(1).stores({
      savedProjects: "++id, name, createdAt, updatedAt",
    });
  }
}

export const db = new PrecastDatabase();
