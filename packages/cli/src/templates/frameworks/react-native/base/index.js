/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";

/**
 * Register the main application component
 * This is the entry point for React Native
 */
AppRegistry.registerComponent(appName, () => App);
