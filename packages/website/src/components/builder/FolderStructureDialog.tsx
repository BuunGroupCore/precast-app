import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo, useState, useCallback } from "react";
import {
  FaTimes,
  FaFolder,
  FaFolderOpen,
  FaFile,
  FaFileCode,
  FaCog,
  FaDatabase,
  FaReact,
  FaVuejs,
  FaAngular,
  FaNodeJs,
  FaDocker,
  FaGitAlt,
  FaArrowLeft,
  FaCode,
  FaLightbulb,
  FaBox,
  FaRocket,
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";
import {
  SiTypescript,
  SiJavascript,
  SiPrisma,
  SiDrizzle,
  SiTailwindcss,
  SiNextdotjs,
  SiNuxtdotjs,
  SiVite,
  SiRemix,
} from "react-icons/si";

import { getFrameworkFiles } from "@/utils/framework-files";
import { processTemplate, getTemplateContent } from "@/utils/template-processor";

import type { ExtendedProjectConfig, FileNode } from "./types";

interface FolderStructureDialogProps {
  isOpen: boolean;
  onClose: () => void;
  config: ExtendedProjectConfig;
}

/**
 * Dialog component that displays a visual representation of the project folder structure.
 * Shows different structures based on whether it's a monorepo or single app configuration.
 */
export const FolderStructureDialog: React.FC<FolderStructureDialogProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  /** Generate all possible folder paths for initial expansion */
  const getAllFolderPaths = useCallback((): Set<string> => {
    const paths = new Set<string>();

    // Add common paths that will exist
    paths.add(config.name);
    paths.add(`${config.name}/src`);
    paths.add(`${config.name}/apps`);
    paths.add(`${config.name}/packages`);
    paths.add(`${config.name}/apps/web`);
    paths.add(`${config.name}/apps/web/src`);
    paths.add(`${config.name}/apps/api`);
    paths.add(`${config.name}/packages/shared`);
    paths.add(`${config.name}/src/components`);
    paths.add(`${config.name}/src/app`);
    paths.add(`${config.name}/src/app/components`);
    paths.add(`${config.name}/src/app/components/counter`);
    paths.add(`${config.name}/src/app/components/hello-world`);

    return paths;
  }, [config.name]);

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(getAllFolderPaths());

  /** Toggle folder expansion */
  const toggleFolder = (folderPath: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderPath)) {
        newSet.delete(folderPath);
      } else {
        newSet.add(folderPath);
      }
      return newSet;
    });
  };

  /** Get framework-specific icon */
  const getFrameworkIcon = (framework: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      react: <FaReact className="text-blue-500" />,
      vue: <FaVuejs className="text-green-500" />,
      angular: <FaAngular className="text-red-500" />,
      next: <SiNextdotjs className="text-black" />,
      nuxt: <SiNuxtdotjs className="text-green-500" />,
      vite: <SiVite className="text-purple-500" />,
      remix: <SiRemix className="text-black" />,
    };
    return icons[framework] || <FaFileCode className="text-gray-500" />;
  };

  /** Get file icon based on extension or type */
  const getFileIcon = (filename: string) => {
    if (filename.includes("tsconfig")) return <SiTypescript className="text-blue-600" />;
    if (filename.endsWith(".ts") || filename.endsWith(".tsx"))
      return <SiTypescript className="text-blue-600" />;
    if (filename.endsWith(".js") || filename.endsWith(".jsx"))
      return <SiJavascript className="text-yellow-500" />;
    if (filename.includes("tailwind")) return <SiTailwindcss className="text-cyan-500" />;
    if (filename.includes("prisma")) return <SiPrisma className="text-purple-600" />;
    if (filename.includes("drizzle")) return <SiDrizzle className="text-green-600" />;
    if (filename.includes("docker")) return <FaDocker className="text-blue-500" />;
    if (filename.includes(".env")) return <FaCog className="text-gray-600" />;
    if (filename === ".gitignore" || filename === ".git")
      return <FaGitAlt className="text-orange-500" />;
    if (filename.includes("package.json")) return <FaNodeJs className="text-green-600" />;
    return <FaFile className="text-gray-400" />;
  };

  /** Get preview content for a file based on its type and config */
  const getFilePreview = useCallback(
    (node: FileNode): string => {
      if (!node.name) return "";

      // Try to get template content first
      const templateContent = getTemplateContent(node.name);
      if (templateContent) {
        // Process the template with the current config
        const context = {
          name: config.name,
          framework: config.framework,
          typescript: config.typescript,
          styling: config.styling,
          backend: config.backend,
          database: config.database,
          orm: config.orm,
          apiClient: config.apiClient,
          auth: config.auth,
        };
        return processTemplate(templateContent, context);
      }

      // Fallback to hardcoded examples for files not in template processor
      if (node.name === "package.json") {
        const deps: string[] = [];
        const devDeps: string[] = [];

        // Add framework dependencies
        if (config.framework === "react") {
          deps.push('    "react": "^18.3.1"', '    "react-dom": "^18.3.1"');
          devDeps.push('    "@vitejs/plugin-react": "^4.3.4"', '    "vite": "^5.4.0"');
        } else if (config.framework === "vue") {
          deps.push('    "vue": "^3.5.0"');
          devDeps.push('    "@vitejs/plugin-vue": "^4.6.2"', '    "vite": "^5.4.0"');
        } else if (config.framework === "next") {
          deps.push('    "next": "14.2.0"', '    "react": "^18.3.1"', '    "react-dom": "^18.3.1"');
        }

        // Add TypeScript
        if (config.typescript) {
          devDeps.push('    "typescript": "^5.7.2"');
          if (config.framework === "react") {
            devDeps.push('    "@types/react": "^18.3.10"', '    "@types/react-dom": "^18.3.0"');
          }
        }

        // Add styling dependencies
        if (config.styling === "tailwind") {
          devDeps.push(
            '    "tailwindcss": "^3.4.13"',
            '    "postcss": "^8.4.47"',
            '    "autoprefixer": "^10.4.20"'
          );
        } else if (config.styling === "scss") {
          devDeps.push('    "sass": "^1.79.4"');
        }

        // Add ORM dependencies
        if (config.orm === "prisma") {
          deps.push('    "@prisma/client": "^5.20.0"');
          devDeps.push('    "prisma": "^5.20.0"');
        }

        return `{
  "name": "${config.name}",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "${config.framework === "next" ? "next dev" : "vite"}",
    "build": "${config.typescript ? "tsc -b && " : ""}${config.framework === "next" ? "next build" : "vite build"}",
    "preview": "${config.framework === "next" ? "next start" : "vite preview"}"${config.typescript ? ',\n    "type-check": "tsc --noEmit"' : ""}${config.orm === "prisma" ? ',\n    "db:generate": "prisma generate",\n    "db:migrate": "prisma migrate dev",\n    "db:push": "prisma db push",\n    "db:studio": "prisma studio"' : ""}
  },
  "dependencies": {
${deps.join(",\n")}
  },
  "devDependencies": {
${devDeps.join(",\n")}
  }
}`;
      }

      // TypeScript config example
      if (node.name === "tsconfig.json") {
        return `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    
    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "${config.framework === "react" || config.framework === "next" ? "react-jsx" : "preserve"}",
    
    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`;
      }

      // Tailwind config example
      if (node.name === "tailwind.config.js") {
        return `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{${config.typescript ? "ts,tsx" : "js,jsx"}}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
      }

      // .env.example
      if (node.name === ".env.example") {
        const envVars: string[] = [];
        if (config.database === "postgres") {
          envVars.push(
            'DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"'
          );
        } else if (config.database === "mysql") {
          envVars.push('DATABASE_URL="mysql://user:password@localhost:3306/mydb"');
        } else if (config.database === "sqlite") {
          envVars.push('DATABASE_URL="file:./dev.db"');
        }
        return envVars.join("\n") || "# Environment variables go here";
      }

      // Prisma schema example
      if (node.name === "schema.prisma") {
        const dbProvider =
          config.database === "postgres"
            ? "postgresql"
            : config.database === "mysql"
              ? "mysql"
              : "sqlite";
        return `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${dbProvider}"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`;
      }

      // Generic files
      return "File preview not available for this file type.";
    },
    [config]
  );

  /** Add path to nodes */
  const addPathToNodes = useCallback((nodes: FileNode[], parentPath = ""): FileNode[] => {
    return nodes.map((node) => {
      const path = parentPath ? `${parentPath}/${node.name}` : node.name;
      return {
        ...node,
        path,
        children: node.children ? addPathToNodes(node.children, path) : undefined,
      };
    });
  }, []);

  /** Generate the folder structure based on configuration */
  const folderStructure = useMemo(() => {
    const isMonorepo = config.backend && config.backend !== "none" && config.backend !== "next-api";
    const frameworkFiles = getFrameworkFiles(config.framework, config.typescript ?? false);

    const structure: FileNode = {
      name: config.name,
      type: "folder",
      icon: FaFolderOpen,
      children: [],
    };

    if (isMonorepo) {
      /** Monorepo structure */
      structure.children = [
        {
          name: "apps",
          type: "folder",
          icon: <FaFolder className="text-comic-blue" />,
          children: [
            {
              name: "web",
              type: "folder",
              icon: getFrameworkIcon(config.framework),
              description: `Frontend (${config.framework})`,
              children: [
                {
                  name: "src",
                  type: "folder",
                  children: frameworkFiles.src.map((file) => ({
                    ...file,
                    icon: file.type === "file" ? getFileIcon(file.name) : undefined,
                    previewContent: file.previewContent
                      ? getFilePreview({ name: file.previewContent, type: "file" })
                      : undefined,
                  })),
                },
                ...(frameworkFiles.public
                  ? [
                      {
                        name: "public",
                        type: "folder" as const,
                        children: frameworkFiles.public.map((file) => ({
                          ...file,
                          icon: file.type === "file" ? getFileIcon(file.name) : undefined,
                          previewContent: file.previewContent
                            ? getFilePreview({ name: file.previewContent, type: "file" })
                            : undefined,
                        })),
                      },
                    ]
                  : []),
                {
                  name: "package.json",
                  type: "file",
                  icon: getFileIcon("package.json"),
                  previewContent: getFilePreview({ name: "package.json", type: "file" }),
                },
                config.typescript && {
                  name: "tsconfig.json",
                  type: "file",
                  icon: getFileIcon("tsconfig.json"),
                  previewContent: getFilePreview({ name: "tsconfig.json", type: "file" }),
                },
              ].filter(Boolean) as FileNode[],
            },
            {
              name: "api",
              type: "folder",
              icon: <FaNodeJs className="text-green-600" />,
              description: `Backend (${config.backend})`,
              children: [
                { name: "src", type: "folder", children: [] },
                {
                  name: "package.json",
                  type: "file",
                  icon: getFileIcon("package.json"),
                  previewContent: getFilePreview({ name: "package.json", type: "file" }),
                },
                config.typescript && {
                  name: "tsconfig.json",
                  type: "file",
                  icon: getFileIcon("tsconfig.json"),
                  previewContent: getFilePreview({ name: "tsconfig.json", type: "file" }),
                },
                config.database !== "none" &&
                  config.orm &&
                  config.orm !== "none" && {
                    name: config.orm === "prisma" ? "prisma" : "drizzle",
                    type: "folder",
                    icon: getFileIcon(config.orm === "prisma" ? "prisma" : "drizzle"),
                    children: [
                      {
                        name: config.orm === "prisma" ? "schema.prisma" : "schema.ts",
                        type: "file",
                        previewContent:
                          config.orm === "prisma"
                            ? getFilePreview({ name: "schema.prisma", type: "file" })
                            : "",
                      },
                    ],
                  },
              ].filter(Boolean) as FileNode[],
            },
          ],
        },
        {
          name: "packages",
          type: "folder",
          icon: <FaFolder className="text-comic-purple" />,
          children: [
            {
              name: "shared",
              type: "folder",
              description: "Shared utilities and types",
              children: [
                { name: "src", type: "folder" },
                {
                  name: "package.json",
                  type: "file",
                  icon: getFileIcon("package.json"),
                  previewContent: getFilePreview({ name: "package.json", type: "file" }),
                },
              ],
            },
          ],
        },
        {
          name: "package.json",
          type: "file",
          icon: getFileIcon("package.json"),
          previewContent: getFilePreview({ name: "package.json", type: "file" }),
        },
        { name: "turbo.json", type: "file", icon: <FaCog className="text-gray-600" /> },
        config.docker && {
          name: "docker-compose.yml",
          type: "file",
          icon: getFileIcon("docker-compose.yml"),
        },
      ].filter(Boolean) as FileNode[];
    } else {
      /** Single app structure */
      structure.children = [
        {
          name: "src",
          type: "folder",
          icon: <FaFolder className="text-comic-yellow" />,
          children: frameworkFiles.src.map((file) => ({
            ...file,
            icon: file.type === "file" ? getFileIcon(file.name) : undefined,
            previewContent: file.previewContent
              ? getFilePreview({ name: file.previewContent, type: "file" })
              : undefined,
          })),
        },
        ...(frameworkFiles.public && frameworkFiles.public.length > 0
          ? [
              {
                name: "public",
                type: "folder" as const,
                icon: <FaFolder className="text-comic-blue" />,
                children: frameworkFiles.public.map((file) => ({
                  ...file,
                  icon: file.type === "file" ? getFileIcon(file.name) : undefined,
                  previewContent: file.previewContent
                    ? getFilePreview({ name: file.previewContent, type: "file" })
                    : undefined,
                })),
              },
            ]
          : []),
        config.database !== "none" &&
          config.orm &&
          config.orm !== "none" && {
            name: config.orm === "prisma" ? "prisma" : "db",
            type: "folder",
            icon: <FaDatabase className="text-purple-600" />,
            children: [
              {
                name: config.orm === "prisma" ? "schema.prisma" : "schema.ts",
                type: "file",
                previewContent:
                  config.orm === "prisma"
                    ? getFilePreview({ name: "schema.prisma", type: "file" })
                    : "",
              },
            ],
          },
        config.aiAssistant === "claude" && {
          name: ".claude",
          type: "folder",
          icon: FaFolder,
          children: [
            { name: "settings.json", type: "file" },
            { name: "CLAUDE.md", type: "file" },
          ],
        },
        {
          name: "package.json",
          type: "file",
          icon: getFileIcon("package.json"),
          previewContent: getFilePreview({ name: "package.json", type: "file" }),
        },
        config.typescript && {
          name: "tsconfig.json",
          type: "file",
          icon: getFileIcon("tsconfig.json"),
          previewContent: getFilePreview({ name: "tsconfig.json", type: "file" }),
        },
        config.styling === "tailwind" && {
          name: "tailwind.config.js",
          type: "file",
          icon: getFileIcon("tailwind.config.js"),
          previewContent: getFilePreview({ name: "tailwind.config.js", type: "file" }),
        },
        {
          name: ".env.example",
          type: "file",
          icon: getFileIcon(".env"),
          previewContent: getFilePreview({ name: ".env.example", type: "file" }),
        },
        config.git && {
          name: ".gitignore",
          type: "file",
          icon: getFileIcon(".gitignore"),
          previewContent: getFilePreview({ name: ".gitignore", type: "file" }),
        },
        config.docker && {
          name: "Dockerfile",
          type: "file",
          icon: getFileIcon("Dockerfile"),
        },
      ].filter(Boolean) as FileNode[];
    }

    // Add paths to all nodes
    const structureWithPaths = {
      ...structure,
      children: addPathToNodes(structure.children || [], structure.name),
    };

    return structureWithPaths;
  }, [config, getFilePreview, addPathToNodes]);

  /** Render a file tree node */
  const renderNode = (node: FileNode, depth = 0) => {
    const isRoot = depth === 0;
    const indent = depth * 20;
    const isExpanded = expandedFolders.has(node.path || node.name);

    const handleClick = () => {
      if (node.type === "file" && node.previewContent) {
        setSelectedFile(node);
      } else if (node.type === "folder") {
        toggleFolder(node.path || node.name);
      }
    };

    return (
      <motion.div
        key={node.path || node.name}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: depth * 0.05 }}
        className={`${isRoot ? "mb-2" : ""}`}
      >
        <div
          className={`flex items-center gap-2 py-1.5 px-2 hover:bg-comic-gray/20 rounded cursor-pointer font-mono text-sm ${
            node.type === "file" && node.previewContent ? "hover:bg-comic-yellow/20" : ""
          }`}
          style={{ paddingLeft: `${indent}px` }}
          onClick={handleClick}
        >
          {node.type === "folder" && node.children && node.children.length > 0 && (
            <span className="text-xs">{isExpanded ? <FaChevronDown /> : <FaChevronRight />}</span>
          )}
          <span className="text-lg">
            {node.icon ? (
              typeof node.icon === "function" ? (
                <node.icon className="text-comic-blue" />
              ) : (
                node.icon
              )
            ) : node.type === "folder" ? (
              isExpanded ? (
                <FaFolderOpen className="text-comic-yellow" />
              ) : (
                <FaFolder className="text-comic-yellow" />
              )
            ) : (
              <FaFile />
            )}
          </span>
          <span className={`${node.type === "folder" ? "font-bold" : ""}`}>{node.name}</span>
          {node.description && (
            <span className="text-xs text-comic-gray ml-2">{`// ${node.description}`}</span>
          )}
          {node.type === "file" && node.previewContent && (
            <FaCode className="text-xs text-comic-purple ml-auto" />
          )}
        </div>
        {node.children && isExpanded && (
          <div>{node.children.map((child: FileNode) => renderNode(child, depth + 1))}</div>
        )}
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-3xl max-h-[80vh] bg-comic-white border-4 border-comic-black rounded-lg overflow-hidden shadow-xl"
          >
            {/* Header */}
            <div className="bg-comic-purple text-comic-white p-6 border-b-4 border-comic-black">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-3xl">PROJECT STRUCTURE</h2>
                  <p className="font-comic text-sm text-comic-white/90 mt-1">
                    Visual preview of your project&apos;s folder organization
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-comic-white/20 rounded-lg transition-colors"
                >
                  <FaTimes className="text-2xl" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {selectedFile ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="flex items-center gap-2 mb-4 text-comic-purple hover:text-comic-darkPurple font-comic font-bold"
                  >
                    <FaArrowLeft />
                    Back to folder structure
                  </button>
                  <div className="bg-comic-gray/10 rounded-lg p-4 border-2 border-comic-gray">
                    <div className="flex items-center gap-2 mb-4">
                      {getFileIcon(selectedFile.name)}
                      <h3 className="font-mono font-bold text-lg">{selectedFile.name}</h3>
                    </div>
                    <pre className="bg-comic-black text-comic-green p-4 rounded-lg overflow-x-auto text-sm font-mono">
                      <code>{selectedFile.previewContent}</code>
                    </pre>
                  </div>
                </motion.div>
              ) : (
                <>
                  <div className="bg-comic-gray/10 rounded-lg p-4 border-2 border-comic-gray">
                    {renderNode(folderStructure)}
                  </div>

                  {/* Info Box */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 p-4 bg-comic-yellow/20 border-2 border-comic-yellow rounded-lg"
                  >
                    <div className="flex items-center gap-2 font-comic text-sm">
                      <FaLightbulb className="text-comic-orange" />
                      <span>
                        <strong>Structure Type:</strong>{" "}
                        {config.backend &&
                        config.backend !== "none" &&
                        config.backend !== "next-api"
                          ? "Monorepo with Turborepo"
                          : "Single Application"}
                      </span>
                    </div>
                    {config.backend &&
                      config.backend !== "none" &&
                      config.backend !== "next-api" && (
                        <div className="flex items-center gap-2 font-comic text-sm mt-2">
                          <FaBox className="text-comic-purple" />
                          <span>
                            Frontend and backend are separated into different packages for better
                            organization
                          </span>
                        </div>
                      )}
                    <div className="flex items-center gap-2 font-comic text-sm mt-2">
                      <FaCode className="text-comic-blue" />
                      <span>
                        Click on files to preview their content • Click folders to expand/collapse
                      </span>
                    </div>
                  </motion.div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="bg-comic-gray p-4 border-t-2 border-comic-darkGray">
              <div className="flex items-center justify-center gap-2 font-comic text-sm text-comic-black">
                <FaRocket className="text-comic-red" />
                <span>This structure will be generated when you run the CLI command</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
