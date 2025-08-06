import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./index.css";

/**
 * Application entry point.
 * Renders the React app to the root DOM element with StrictMode enabled.
 */
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
