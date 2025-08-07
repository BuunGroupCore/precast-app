/**
 * ESLint configuration for React Native
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  root: true,
  extends: "@react-native",
  rules: {
    // Use double quotes for consistency
    quotes: ["error", "double"],
    // Ensure proper spacing in imports
    "object-curly-spacing": ["error", "always"],
    // Consistent semicolons
    semi: ["error", "always"],
  },
};
