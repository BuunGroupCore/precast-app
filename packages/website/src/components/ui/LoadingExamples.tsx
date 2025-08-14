import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LoadingSpinner,
  InlineSpinner,
  LoadingOverlay,
  SimpleLoadingOverlay,
  SkeletonComponents,
  ProgressBar,
  IndeterminateProgressBar,
} from "./index";
import { useAsync, useLoading, useProgressiveLoading, useLoadingTask } from "@/hooks";

/**
 * Comprehensive examples demonstrating all loading components and patterns.
 * This component serves as both documentation and testing for the loading system.
 */
export function LoadingExamples() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showSimpleOverlay, setShowSimpleOverlay] = useState(false);
  const [progress, setProgress] = useState(45);
  const loadingTask = useLoadingTask("example-task");

  // Example async function for demonstration
  const exampleAsync = async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return "Data loaded!";
  };

  const asyncExample = useAsync(exampleAsync, { immediate: false });
  const loadingStates = useLoading(["data", "form", "upload"]);

  // Progressive loading example
  const sampleData = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);
  const progressiveExample = useProgressiveLoading(sampleData, {
    batchSize: 10,
    delay: 200,
  });

  // Auto-hide simple overlay after 3 seconds
  useEffect(() => {
    if (showSimpleOverlay) {
      const timer = setTimeout(() => setShowSimpleOverlay(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSimpleOverlay]);

  return (
    <div className="p-8 space-y-12 max-w-6xl mx-auto">
      <div className="text-center">
        <h1 className="action-text text-4xl text-comic-red mb-4">LOADING SYSTEM EXAMPLES</h1>
        <p className="font-comic text-lg text-comic-black">
          Comprehensive demonstration of all loading components and patterns
        </p>
      </div>

      {/* Spinner Examples */}
      <section className="comic-panel p-6">
        <h2 className="font-display text-2xl text-comic-blue mb-6">Loading Spinners</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="text-center space-y-4">
            <h3 className="font-comic font-bold">Dots Variant</h3>
            <LoadingSpinner variant="dots" color="red" size="md" message="Loading..." />
          </div>

          <div className="text-center space-y-4">
            <h3 className="font-comic font-bold">Spinner Variant</h3>
            <LoadingSpinner variant="spinner" color="blue" size="md" message="Processing..." />
          </div>

          <div className="text-center space-y-4">
            <h3 className="font-comic font-bold">Pulse Variant</h3>
            <LoadingSpinner variant="pulse" color="purple" size="md" message="Thinking..." />
          </div>

          <div className="text-center space-y-4">
            <h3 className="font-comic font-bold">Bounce Variant</h3>
            <LoadingSpinner variant="bounce" color="green" size="md" message="Bouncing..." />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center space-y-4">
            <h3 className="font-comic font-bold">Small Size</h3>
            <LoadingSpinner size="sm" color="orange" />
          </div>

          <div className="text-center space-y-4">
            <h3 className="font-comic font-bold">Large Size</h3>
            <LoadingSpinner size="lg" color="red" />
          </div>

          <div className="text-center space-y-4">
            <h3 className="font-comic font-bold">Inline Spinner</h3>
            <p className="font-comic">
              Loading data <InlineSpinner color="blue" /> please wait...
            </p>
          </div>
        </div>
      </section>

      {/* Skeleton Examples */}
      <section className="comic-panel p-6">
        <h2 className="font-display text-2xl text-comic-green mb-6">Skeleton Loaders</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="font-comic font-bold mb-4">Text Skeleton</h3>
            <SkeletonComponents.Text lines={4} />
          </div>

          <div>
            <h3 className="font-comic font-bold mb-4">Card Skeleton</h3>
            <SkeletonComponents.Card />
          </div>

          <div>
            <h3 className="font-comic font-bold mb-4">Metric Card Skeleton</h3>
            <SkeletonComponents.MetricCard />
          </div>

          <div>
            <h3 className="font-comic font-bold mb-4">Chart Skeleton</h3>
            <SkeletonComponents.Chart className="h-32" />
          </div>

          <div>
            <h3 className="font-comic font-bold mb-4">List Items</h3>
            <div className="space-y-2">
              <SkeletonComponents.ListItem />
              <SkeletonComponents.ListItem />
              <SkeletonComponents.ListItem />
            </div>
          </div>

          <div>
            <h3 className="font-comic font-bold mb-4">Avatar & Button</h3>
            <div className="flex items-center space-x-4">
              <SkeletonComponents.Avatar size="lg" />
              <div className="space-y-2">
                <SkeletonComponents.Button size="md" />
                <SkeletonComponents.Button size="sm" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Bar Examples */}
      <section className="comic-panel p-6">
        <h2 className="font-display text-2xl text-comic-purple mb-6">Progress Bars</h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-comic font-bold mb-4">Standard Progress</h3>
            <ProgressBar
              value={progress}
              label="Upload Progress"
              showPercentage={true}
              color="blue"
              variant="default"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setProgress(Math.max(0, progress - 10))}
                className="px-3 py-1 bg-comic-red text-white rounded font-comic"
              >
                -10%
              </button>
              <button
                onClick={() => setProgress(Math.min(100, progress + 10))}
                className="px-3 py-1 bg-comic-green text-white rounded font-comic"
              >
                +10%
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-comic font-bold mb-4">Comic Style Progress</h3>
            <ProgressBar
              value={75}
              label="Comic Progress"
              showPercentage={true}
              color="red"
              variant="comic"
            />
          </div>

          <div>
            <h3 className="font-comic font-bold mb-4">Striped Progress</h3>
            <ProgressBar
              value={60}
              label="Download Progress"
              showPercentage={true}
              color="purple"
              variant="striped"
            />
          </div>

          <div>
            <h3 className="font-comic font-bold mb-4">Indeterminate Progress</h3>
            <IndeterminateProgressBar label="Processing..." color="green" />
          </div>
        </div>
      </section>

      {/* Overlay Examples */}
      <section className="comic-panel p-6">
        <h2 className="font-display text-2xl text-comic-orange mb-6">Loading Overlays</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="text-center space-y-4">
            <h3 className="font-comic font-bold">Full Loading Overlay</h3>
            <button
              onClick={() => setShowOverlay(true)}
              className="px-6 py-3 bg-comic-blue text-white rounded-lg font-comic hover:bg-comic-darkBlue transition-colors"
            >
              Show Loading Overlay
            </button>
          </div>

          <div className="text-center space-y-4">
            <h3 className="font-comic font-bold">Simple Overlay</h3>
            <button
              onClick={() => setShowSimpleOverlay(true)}
              className="px-6 py-3 bg-comic-purple text-white rounded-lg font-comic hover:bg-comic-darkPurple transition-colors"
            >
              Show Simple Overlay
            </button>
          </div>
        </div>
      </section>

      {/* Hook Examples */}
      <section className="comic-panel p-6">
        <h2 className="font-display text-2xl text-comic-red mb-6">Loading Hooks Examples</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-comic font-bold mb-4">useAsync Hook</h3>
            <div className="space-y-4">
              <button
                onClick={() => asyncExample.execute()}
                disabled={asyncExample.loading}
                className="px-4 py-2 bg-comic-green text-white rounded font-comic disabled:opacity-50"
              >
                {asyncExample.loading ? (
                  <>
                    <InlineSpinner color="yellow" /> Loading...
                  </>
                ) : (
                  "Load Data"
                )}
              </button>

              {asyncExample.data && (
                <p className="font-comic text-comic-green">{asyncExample.data}</p>
              )}

              {asyncExample.error && (
                <p className="font-comic text-comic-red">Error: {asyncExample.error.message}</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-comic font-bold mb-4">useLoading Hook</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => loadingStates.setLoading("data", !loadingStates.isLoading("data"))}
                  className="px-4 py-2 bg-comic-blue text-white rounded font-comic"
                >
                  Toggle Data Loading
                </button>
                <button
                  onClick={() => loadingStates.setLoading("form", !loadingStates.isLoading("form"))}
                  className="px-4 py-2 bg-comic-purple text-white rounded font-comic"
                >
                  Toggle Form Loading
                </button>
              </div>

              <div className="space-y-2">
                <p className="font-comic">
                  Data: {loadingStates.isLoading("data") ? <InlineSpinner color="blue" /> : "Ready"}
                </p>
                <p className="font-comic">
                  Form:{" "}
                  {loadingStates.isLoading("form") ? <InlineSpinner color="purple" /> : "Ready"}
                </p>
                <p className="font-comic">
                  Any Loading: {loadingStates.isAnyLoading() ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progressive Loading Example */}
      <section className="comic-panel p-6">
        <h2 className="font-display text-2xl text-comic-yellow mb-6">Progressive Loading</h2>

        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => progressiveExample.loadNext()}
              disabled={!progressiveExample.hasMore || progressiveExample.loading}
              className="px-4 py-2 bg-comic-green text-white rounded font-comic disabled:opacity-50"
            >
              Load Next Batch
            </button>
            <button
              onClick={() => progressiveExample.loadAll()}
              disabled={!progressiveExample.hasMore || progressiveExample.loading}
              className="px-4 py-2 bg-comic-blue text-white rounded font-comic disabled:opacity-50"
            >
              Load All
            </button>
            <button
              onClick={() => progressiveExample.reset()}
              className="px-4 py-2 bg-comic-red text-white rounded font-comic"
            >
              Reset
            </button>
          </div>

          <ProgressBar
            value={progressiveExample.progress}
            label={`Loaded ${progressiveExample.currentBatch}/${progressiveExample.totalBatches} batches`}
            showPercentage={true}
            color="green"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-40 overflow-y-auto">
            {progressiveExample.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="p-2 bg-comic-white border border-comic-black rounded text-xs font-comic text-center"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Loading Task Example */}
      <section className="comic-panel p-6">
        <h2 className="font-display text-2xl text-comic-blue mb-6">Global Loading Task</h2>

        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => loadingTask.start("Processing global task...")}
              disabled={loadingTask.isLoading}
              className="px-4 py-2 bg-comic-purple text-white rounded font-comic disabled:opacity-50"
            >
              Start Global Task
            </button>
            <button
              onClick={() => loadingTask.stop()}
              disabled={!loadingTask.isLoading}
              className="px-4 py-2 bg-comic-red text-white rounded font-comic disabled:opacity-50"
            >
              Stop Task
            </button>
            <button
              onClick={() => loadingTask.setProgress(Math.random() * 100)}
              disabled={!loadingTask.isLoading}
              className="px-4 py-2 bg-comic-green text-white rounded font-comic disabled:opacity-50"
            >
              Random Progress
            </button>
          </div>

          <p className="font-comic">
            Status:{" "}
            {loadingTask.isLoading ? (
              <>
                <InlineSpinner color="purple" /> Loading
              </>
            ) : (
              "Idle"
            )}
          </p>

          {loadingTask.loadingState && (
            <div className="space-y-2">
              <p className="font-comic">Message: {loadingTask.loadingState.message}</p>
              {loadingTask.loadingState.progress !== undefined && (
                <ProgressBar
                  value={loadingTask.loadingState.progress}
                  showPercentage={true}
                  color="purple"
                />
              )}
            </div>
          )}
        </div>
      </section>

      {/* Loading Overlays */}
      <LoadingOverlay
        isVisible={showOverlay}
        message="Loading amazing content..."
        variant="dots"
        color="blue"
        onClose={() => setShowOverlay(false)}
      />

      <SimpleLoadingOverlay
        isVisible={showSimpleOverlay}
        message="Processing..."
        variant="spinner"
        color="purple"
      />
    </div>
  );
}
