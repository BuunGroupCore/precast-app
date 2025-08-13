module.exports = {
  root: true,
  extends: ["../../.eslintrc.js"],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  rules: {
    // Shared package specific rules
    "no-console": "error", // No console logs in shared utilities
  },
};
