import { PostHogProvider } from "posthog-js/react";
import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./index.css";
import { ANALYTICS } from "./config/constants";

const options = {
  api_host: ANALYTICS.POSTHOG_HOST,
  capture_pageview: false,
  capture_pageleave: true,
  disable_session_recording: true,
  disable_compression: true,
  advanced_disable_decide: true,
  loaded: (posthog: { config?: { disable_session_recording?: boolean } }) => {
    // Disable session recording and other features that require external scripts
    if (posthog.config) {
      posthog.config.disable_session_recording = true;
    }
  },
};

/**
 * Application entry point.
 * Renders the React app to the root DOM element with StrictMode and PostHog provider.
 */
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PostHogProvider apiKey={ANALYTICS.POSTHOG_API_KEY} options={options}>
      <App />
    </PostHogProvider>
  </React.StrictMode>
);
