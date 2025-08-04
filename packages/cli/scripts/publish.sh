#!/bin/bash
set -e

echo "🚀 Preparing to publish create-precast-app..."

# Ensure we have the required tools
command -v bun >/dev/null 2>&1 || { echo "❌ Error: bun is required but not installed." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ Error: npm is required but not installed." >&2; exit 1; }

# Set up Node.js in PATH if needed
if ! command -v node >/dev/null 2>&1; then
    echo "⚠️  Node.js not found in PATH, attempting to source nvm..."
    if [ -f "$HOME/.nvm/nvm.sh" ]; then
        source "$HOME/.nvm/nvm.sh"
        nvm use node
    elif [ -f "$HOME/.bashrc" ]; then
        source "$HOME/.bashrc"
    fi
fi

# Verify node is now available
command -v node >/dev/null 2>&1 || { echo "❌ Error: node is still not available after PATH setup." >&2; exit 1; }

echo "✅ Environment check passed"
echo "   Node.js: $(node --version)"
echo "   Bun: $(bun --version)"
echo "   npm: $(npm --version)"

# Run pre-publish checks
echo "🧪 Running pre-publish checks..."
bun run build
bun run typecheck
bun run lint

echo "📦 All checks passed! Package is ready for publishing."
echo ""
echo "Publishing commands (run these manually):"
echo ""
echo "🚀 For patch release (v0.1.1):"
echo "  bun run publish:patch"
echo ""
echo "🚀 For minor release (v0.2.0):" 
echo "  bun run publish:minor"
echo ""
echo "🚀 For major release (v1.0.0):"
echo "  bun run publish:major"
echo ""
echo "🧪 To test before publishing:"
echo "  bun run build && npm publish --dry-run"