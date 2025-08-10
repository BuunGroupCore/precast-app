/**
 * Getting Started section component
 * Provides helpful tips for developers to get started
 */
export function GettingStarted() {
  return (
    <div className="mb-20 text-center">
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Ready to Start Building</h2>
        <p className="text-gray-300 mb-6">
          Your development environment is configured and ready to go. Start editing your application
          and see changes instantly.
        </p>
        <p className="text-sm text-gray-500">
          💡 Edit{" "}
          <code className="text-purple-400 bg-slate-900/50 px-3 py-1 rounded-lg font-mono">
            src/App.tsx
          </code>{" "}
          to see Hot Module Replacement in action
        </p>
      </div>
    </div>
  );
}
