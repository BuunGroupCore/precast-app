import * as path from "path";

import { consola } from "consola";
// eslint-disable-next-line import/default
import fsExtra from "fs-extra";

// eslint-disable-next-line import/no-named-as-default-member
const { ensureDir, writeFile, pathExists } = fsExtra;

import type { ProjectConfig } from "../../../../shared/stack-config.js";
import type { TemplateEngine } from "../../core/template-engine.js";
import { installDependencies } from "../../utils/package-manager.js";

import type { ORMGenerator } from "./orm-generator.interface.js";

export class MongooseGenerator implements ORMGenerator {
  id = "mongoose";
  name = "Mongoose";
  supportedDatabases = ["mongodb"];

  async setup(
    config: ProjectConfig,
    projectPath: string,
    templateEngine: TemplateEngine
  ): Promise<void> {
    consola.info("Setting up Mongoose...");

    // Create Mongoose directories
    await ensureDir(path.join(projectPath, "src", "models"));
    await ensureDir(path.join(projectPath, "src", "database"));
    await ensureDir(path.join(projectPath, "src", "database", "scripts"));

    // Generate connection file
    await this.generateClient(config, projectPath, templateEngine);

    // Generate schema files
    await this.generateSchema(config, projectPath, templateEngine);

    // Generate seed script
    await this.setupMigrations?.(config, projectPath);
  }

  async installDependencies(config: ProjectConfig, projectPath: string): Promise<void> {
    const packages = ["mongoose"];

    // Note: @types/mongoose is no longer needed as Mongoose includes its own TypeScript definitions

    // Install packages
    consola.info("📦 Installing Mongoose packages...");
    await installDependencies(packages, {
      packageManager: config.packageManager,
      projectPath,
      dev: false,
    });
  }

  async generateSchema(
    config: ProjectConfig,
    projectPath: string,
    templateEngine: TemplateEngine
  ): Promise<void> {
    const templateRoot = templateEngine["templateRoot"];

    // Use Mongoose model template if available
    const modelTemplate = path.join(templateRoot, "database/mongoose/models/User.ts.hbs");

    if (await pathExists(modelTemplate)) {
      await templateEngine.processTemplate(
        modelTemplate,
        path.join(projectPath, "src/models", config.typescript ? "User.ts" : "User.js"),
        config
      );
    } else {
      // Fallback to default model
      await this.generateDefaultModel(config, projectPath);
    }
  }

  async generateClient(
    config: ProjectConfig,
    projectPath: string,
    templateEngine: TemplateEngine
  ): Promise<void> {
    const templateRoot = templateEngine["templateRoot"];

    // Use Mongoose connection template if available
    const connectionTemplate = path.join(templateRoot, "database/mongoose/connection.ts.hbs");

    if (await pathExists(connectionTemplate)) {
      await templateEngine.processTemplate(
        connectionTemplate,
        path.join(
          projectPath,
          "src/database",
          config.typescript ? "connection.ts" : "connection.js"
        ),
        config
      );
    } else {
      // Fallback to default connection
      await this.generateDefaultConnection(config, projectPath);
    }
  }

  async setupMigrations(config: ProjectConfig, projectPath: string): Promise<void> {
    // Create seed script
    const seedContent = config.typescript
      ? `
import mongoose from 'mongoose';
import { User } from '../models/User';

const seedData = async () => {
  try {
    console.log('🌱 Starting seeding process...');
    
    // Clear existing data
    await User.deleteMany({});
    
    // Create sample users
    const users = await User.create([
      {
        email: 'admin@example.com',
        name: 'Admin User',
      },
      {
        email: 'user@example.com',
        name: 'Regular User',
      },
    ]);
    
    console.log(\`✅ Created \${users.length} users\`);
    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};

const connectAndSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test');
    console.log('📊 Connected to MongoDB');
    
    await seedData();
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

connectAndSeed()
  .then(() => {
    console.log('✅ Seed script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed script failed:', error);
    process.exit(1);
  });
`
      : `
const mongoose = require('mongoose');
const { User } = require('../models/User');

const seedData = async () => {
  try {
    console.log('🌱 Starting seeding process...');
    
    // Clear existing data
    await User.deleteMany({});
    
    // Create sample users
    const users = await User.create([
      {
        email: 'admin@example.com',
        name: 'Admin User',
      },
      {
        email: 'user@example.com',
        name: 'Regular User',
      },
    ]);
    
    console.log(\`✅ Created \${users.length} users\`);
    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};

const connectAndSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test');
    console.log('📊 Connected to MongoDB');
    
    await seedData();
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

connectAndSeed()
  .then(() => {
    console.log('✅ Seed script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed script failed:', error);
    process.exit(1);
  });
`;

    await writeFile(
      path.join(projectPath, "src/database/scripts", config.typescript ? "seed.ts" : "seed.js"),
      seedContent.trim()
    );
  }

  private async generateDefaultModel(config: ProjectConfig, projectPath: string): Promise<void> {
    const modelContent = config.typescript
      ? `
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
UserSchema.index({ email: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
`
      : `
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
UserSchema.index({ email: 1 });

const User = mongoose.model('User', UserSchema);

module.exports = { User };
`;

    await writeFile(
      path.join(projectPath, "src/models", config.typescript ? "User.ts" : "User.js"),
      modelContent.trim()
    );
  }

  private async generateDefaultConnection(
    config: ProjectConfig,
    projectPath: string
  ): Promise<void> {
    const connectionContent = config.typescript
      ? `
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/${config.name}';

export const connectDB = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(\`MongoDB Connected: \${conn.connection.host}\`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
  } catch (error) {
    console.error('Error disconnecting from database:', error);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});
`
      : `
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/${config.name}';

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(\`MongoDB Connected: \${conn.connection.host}\`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
  } catch (error) {
    console.error('Error disconnecting from database:', error);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

module.exports = { connectDB, disconnectDB };
`;

    await writeFile(
      path.join(projectPath, "src/database", config.typescript ? "connection.ts" : "connection.js"),
      connectionContent.trim()
    );
  }

  getNextSteps(): string[] {
    return [
      "1. Make sure MongoDB is running locally or update MONGODB_URI in .env",
      "2. Run the seed script to populate initial data",
      "3. Create additional models in the src/models directory",
      "4. Use Mongoose queries in your routes/controllers",
      "5. Learn more at https://mongoosejs.com/docs/",
    ];
  }
}
