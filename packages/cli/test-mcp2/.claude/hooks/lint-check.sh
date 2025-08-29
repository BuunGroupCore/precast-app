#!/bin/bash

set -e

# Environment variables from Claude
TOOL_NAME="${TOOL_NAME:-}"
FILE_PATH="${FILE_PATH:-}"

# Supported file extensions
LINTABLE_EXTENSIONS="js jsx ts tsx mjs cjs"

# Check if file should be linted
should_lint() {
    local file="$1"
    local ext="${file##*.}"
    
    for valid_ext in $LINTABLE_EXTENSIONS; do
        [ "$ext" = "$valid_ext" ] && return 0
    done
    return 1
}

# Check for ESLint config
has_eslint() {
    [ -f ".eslintrc.json" ] || [ -f ".eslintrc.js" ] || [ -f "eslint.config.js" ]
}

# Check for Prettier config
has_prettier() {
    [ -f ".prettierrc" ] || [ -f ".prettierrc.json" ] || [ -f ".prettierrc.js" ] || [ -f "prettier.config.js" ]
}

# Run ESLint
run_eslint() {
    local file="$1"
    if has_eslint && command -v npx >/dev/null 2>&1; then
        echo "🔍 ESLint: Checking $file"
        if ! npx eslint "$file" --format compact 2>/dev/null; then
            echo "⚠️  ESLint issues found. Run: npx eslint --fix \"$file\""
            return 1
        fi
    fi
    return 0
}

# Run Prettier
run_prettier() {
    local file="$1"
    if has_prettier && command -v npx >/dev/null 2>&1; then
        echo "🎨 Prettier: Checking $file"
        if ! npx prettier --check "$file" 2>/dev/null; then
            echo "⚠️  Formatting needed. Run: npx prettier --write \"$file\""
            return 1
        fi
    fi
    return 0
}

# Main
main() {
    # Exit if no file or wrong tool
    [ -z "$FILE_PATH" ] && exit 0
    
    case "$TOOL_NAME" in
        Edit|Write|MultiEdit) ;;
        *) exit 0 ;;
    esac
    
    # Check if file should be linted
    should_lint "$FILE_PATH" || exit 0
    
    echo "📝 Running code style checks..."
    
    # Track if any issues found
    issues_found=false
    
    run_eslint "$FILE_PATH" || issues_found=true
    run_prettier "$FILE_PATH" || issues_found=true
    
    if [ "$issues_found" = true ]; then
        echo ""
        echo "💡 Suggestions above - changes will still be applied"
    else
        echo "✅ All checks passed"
    fi
    
    # Never block the operation
    exit 0
}

main