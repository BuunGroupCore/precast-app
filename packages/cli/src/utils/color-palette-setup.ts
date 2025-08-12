import fs from "fs/promises";
import path from "path";

import chalk from "chalk";

import { getColorPaletteById } from "../../../shared/src/color-palettes.js";
import { type ProjectConfig } from "../../../shared/stack-config.js";
import { createTemplateEngine } from "../core/template-engine.js";

import { logger } from "./logger.js";
import { getTemplateRoot } from "./template-path.js";

/**
 * Setup color palette theme for the project
 * @param config - Project configuration with color palette selection
 * @param projectPath - Path to the project directory
 */
export async function setupColorPalette(config: ProjectConfig, projectPath: string): Promise<void> {
  if (!config.colorPalette) {
    return;
  }

  const palette = getColorPaletteById(config.colorPalette);
  if (!palette) {
    logger.error(`Color palette '${config.colorPalette}' not found`);

    // Import colorPalettes to show valid options
    const { colorPalettes, getColorPalettesByCategory } = await import(
      "../../../shared/src/color-palettes.js"
    );

    // Check if it's a category name
    const categories = ["modern", "retro", "professional", "playful", "dark", "light"];
    if (categories.includes(config.colorPalette)) {
      const categoryPalettes = getColorPalettesByCategory(config.colorPalette as any);
      if (categoryPalettes.length > 0) {
        logger.info(`'${config.colorPalette}' is a category, not a palette ID.`);
        logger.info(`Available ${config.colorPalette} palettes:`);
        categoryPalettes.forEach((p) => {
          logger.info(`  - ${p.id}: ${p.description}`);
        });
      }
    } else {
      logger.info("Available color palette IDs:");
      colorPalettes.forEach((p) => {
        logger.info(`  - ${p.id}: ${p.description}`);
      });
    }

    logger.info("\nUse one of the palette IDs above with --color-palette flag");
    return;
  }

  // Get preview colors or use main colors
  const previewColors = palette.preview || [
    palette.colors.primary,
    palette.colors.secondary,
    palette.colors.accent,
    palette.colors.background,
  ];

  // Create colored circles display
  const colorDisplay = previewColors.map((color) => chalk.hex(color)("●")).join(" ");

  logger.info(`Setting up color palette: ${colorDisplay} ${palette.name}`);

  const templateRoot = getTemplateRoot();
  const templateEngine = createTemplateEngine(templateRoot);

  // Prepare context with color palette data
  const context = {
    ...config,
    colorPalette: palette,
    styling: config.styling,
    typescript: config.typescript,
  };

  try {
    // Always generate documentation
    await generateColorPaletteDocumentation(context, projectPath, templateEngine, templateRoot);
    if (config.styling === "tailwind") {
      // Use the generateTailwindConfig function from shared
      const { generateTailwindConfig } = await import("../../../shared/src/color-palettes.js");
      const tailwindConfigPath = path.join(projectPath, "tailwind.config.js");

      // Check if tailwind config exists
      const configExists = await fs
        .access(tailwindConfigPath)
        .then(() => true)
        .catch(() => false);

      if (configExists) {
        // Read existing config and merge theme
        const existingConfig = await fs.readFile(tailwindConfigPath, "utf-8");
        const colorConfig = generateTailwindConfig(palette);

        if (colorConfig) {
          // Insert color config into existing theme.extend
          let updatedConfig = existingConfig;
          const extendMatch = existingConfig.match(/theme:\s*{\s*extend:\s*{/);

          if (extendMatch) {
            // Insert colors into existing extend block
            const insertIndex = extendMatch.index! + extendMatch[0].length;
            updatedConfig =
              existingConfig.slice(0, insertIndex) +
              "\n      " +
              colorConfig +
              "," +
              existingConfig.slice(insertIndex);
          } else {
            // Add theme.extend block
            const themeMatch = existingConfig.match(/module\.exports\s*=\s*{/);
            if (themeMatch) {
              const insertIndex = themeMatch.index! + themeMatch[0].length;
              updatedConfig =
                existingConfig.slice(0, insertIndex) +
                "\n  theme: {\n    extend: {\n      " +
                colorConfig +
                "\n    }\n  }," +
                existingConfig.slice(insertIndex);
            }
          }

          await fs.writeFile(tailwindConfigPath, updatedConfig);
          logger.success("Updated Tailwind configuration with color palette");
        }
      } else {
        // Create new tailwind config with theme
        const colorConfig = generateTailwindConfig(palette);
        const fullConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue,svelte}",
  ],
  theme: {
    extend: {
      ${colorConfig}
    }
  },
  plugins: [],
}`;
        await fs.writeFile(tailwindConfigPath, fullConfig);
        logger.success("Created Tailwind configuration with color palette");
      }
    } else if (config.styling === "css" || config.styling === "scss") {
      // Generate CSS variables file
      const targetDir = path.join(projectPath, "src", "styles");
      const targetFile = path.join(targetDir, "palette.css");

      // Ensure styles directory exists
      await fs.mkdir(targetDir, { recursive: true });

      // Generate CSS content using the shared function
      const { generateCSSVariables } = await import("../../../shared/src/color-palettes.js");
      const cssContent = generateCSSVariables(palette);
      await fs.writeFile(targetFile, cssContent);

      // Add import to main CSS file if it exists
      const mainCssFiles = ["app.css", "index.css", "main.css", "global.css", "styles.css"];
      for (const filename of mainCssFiles) {
        const mainCssPath = path.join(targetDir, filename);
        const exists = await fs
          .access(mainCssPath)
          .then(() => true)
          .catch(() => false);

        if (exists) {
          const content = await fs.readFile(mainCssPath, "utf-8");
          if (!content.includes("palette.css")) {
            const updatedContent = `@import './palette.css';\n\n${content}`;
            await fs.writeFile(mainCssPath, updatedContent);
            logger.success(`Added color palette import to ${filename}`);
          }
          break;
        }
      }

      logger.success("Created CSS color palette file");
    }
  } catch (error) {
    logger.error(`Failed to setup color palette: ${error}`);
    throw error;
  }
}

/**
 * Generate color palette documentation in the docs folder
 */
async function generateColorPaletteDocumentation(
  context: any,
  projectPath: string,
  templateEngine: any,
  _templateRoot: string
): Promise<void> {
  try {
    // Create docs directory
    const docsDir = path.join(projectPath, "docs");
    await fs.mkdir(docsDir, { recursive: true });

    // Generate color palette documentation from template
    await templateEngine.processTemplate(
      path.join("docs", "color-palette.md.hbs"),
      path.join(docsDir, "color-palette.md"),
      context
    );

    logger.success("Created color palette documentation in docs/color-palette.md");
  } catch (error) {
    logger.warn(`Failed to generate color palette documentation: ${error}`);
  }
}
