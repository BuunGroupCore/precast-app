import path from "path";

import { consola } from "consola";
import fsExtra from "fs-extra";

import { type ProjectConfig } from "../../../shared/stack-config.js";

import { createTemplateEngine } from "../core/template-engine.js";
import { getTemplateRoot } from "../utils/template-path.js";

// eslint-disable-next-line import/no-named-as-default-member
const { writeFile, ensureDir } = fsExtra;

/**
 * Generate a FastAPI project template
 * @param config - Project configuration
 * @param projectPath - Path where the project will be created
 */
export async function generateFastApiTemplate(config: ProjectConfig, projectPath: string) {
  const templateRoot = getTemplateRoot();
  const templateEngine = createTemplateEngine(templateRoot);

  try {
    consola.info("Generating FastAPI backend...");

    // Copy base FastAPI files
    await templateEngine.copyTemplateDirectory(`backends/fastapi/base`, projectPath, config, {
      overwrite: true,
    });

    // Create a simple README file
    const readmeContent = `# ${config.name} - FastAPI Backend

A modern FastAPI backend application generated with Precast CLI.

## Quick Start

### Prerequisites
- Python 3.11+
- [UV](https://github.com/astral-sh/uv) (recommended) or pip

### Installation & Running

**Option 1: Using UV (Recommended)**
\`\`\`bash
# Install UV if you haven't already
curl -LsSf https://astral.sh/uv/install.sh | sh

# Run the FastAPI server directly
uv run --with fastapi --with "uvicorn[standard]" uvicorn app.main:app --reload
\`\`\`

**Option 2: Using pip**
\`\`\`bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\\Scripts\\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload
\`\`\`

### Access Your API
- **API**: http://localhost:8000
- **Interactive docs**: http://localhost:8000/docs
- **ReDoc docs**: http://localhost:8000/redoc

## API Endpoints

- \`GET /\` - Welcome message
- \`GET /health\` - Health check
- \`GET /api/v1/items/{item_id}\` - Example parameterized endpoint

## Project Structure

\`\`\`
app/
└── main.py         # FastAPI application (minimal setup)
requirements.txt    # Python dependencies
pyproject.toml     # Project configuration
\`\`\`

## Development

\`\`\`bash
# Format code (install ruff first)
uv add --dev ruff
uv run ruff format .

# Type checking
uv add --dev mypy
uv run mypy app/
\`\`\`

Generated with [Precast CLI](https://precast.dev) 🚀
`;

    await writeFile(path.join(projectPath, "README.md"), readmeContent);

    // Create minimal app directory with just main.py
    await ensureDir(path.join(projectPath, "app"));
    await templateEngine.processTemplate(
      `backends/fastapi/app/main.py.hbs`,
      path.join(projectPath, "app", "main.py"),
      config
    );

    // Create empty __init__.py
    await writeFile(path.join(projectPath, "app", "__init__.py"), "");

    consola.success("FastAPI backend generated successfully!");
  } catch (error) {
    consola.error("Failed to generate FastAPI backend:", error);
    throw error;
  }
}
