import path from "path";

import { consola } from "consola";
import fsExtra from "fs-extra";

import type { ProjectConfig } from "../../../../shared/stack-config.js";

import { generatePackageJson } from "./base-generator.js";

// eslint-disable-next-line import/no-named-as-default-member
const { writeFile, ensureDir } = fsExtra;

/**
 * Generate React Native project template
 */
export async function generateReactNativeTemplate(
  config: ProjectConfig,
  projectPath: string
): Promise<void> {
  consola.info("Creating React Native project structure...");

  /** Create directory structure */
  const directories = [
    "src",
    "src/components",
    "src/screens",
    "src/navigation",
    "src/utils",
    "src/hooks",
    "assets",
    "assets/images",
    "assets/fonts",
    "__tests__",
    "android",
    "ios",
  ];

  for (const dir of directories) {
    await ensureDir(path.join(projectPath, dir));
  }

  /** Generate package.json with React Native dependencies */
  const dependencies = [
    "react",
    "react-native",
    "@react-navigation/native",
    "@react-navigation/stack",
    "react-native-screens",
    "react-native-safe-area-context",
    "react-native-gesture-handler",
  ];

  const devDependencies = [
    "@types/react",
    "@types/react-native",
    "@react-native/metro-config",
    "@react-native/typescript-config",
    "metro-react-native-babel-preset",
    "@babel/core",
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript",
    "jest",
    "@testing-library/react-native",
  ];

  if (config.typescript) {
    devDependencies.push("typescript");
  }

  await generatePackageJson(config, projectPath, dependencies, devDependencies, {
    main: "index.js",
    scripts: {
      android: "react-native run-android",
      ios: "react-native run-ios",
      start: "react-native start",
      test: "jest",
      lint: "eslint . --ext .js,.jsx,.ts,.tsx",
    },
  });

  /** Generate app entry point */
  const appContent = config.typescript
    ? `import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createStackNavigator();

/**
 * Main application component
 */
function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
`
    : `import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createStackNavigator();

/**
 * Main application component
 */
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
`;

  await writeFile(path.join(projectPath, config.typescript ? "App.tsx" : "App.js"), appContent);

  /** Generate index.js */
  const indexContent = `import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
`;

  await writeFile(path.join(projectPath, "index.js"), indexContent);

  /** Generate app.json */
  const appJsonContent = {
    name: config.name,
    displayName: config.name,
  };

  await writeFile(path.join(projectPath, "app.json"), JSON.stringify(appJsonContent, null, 2));

  /** Generate HomeScreen */
  const homeScreenContent = config.typescript
    ? `import React from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';

/**
 * Home screen component
 */
const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to ${config.name}!</Text>
        <Text style={styles.subtitle}>
          Your React Native app is ready to go.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeScreen;
`
    : `import React from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';

/**
 * Home screen component
 */
const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to ${config.name}!</Text>
        <Text style={styles.subtitle}>
          Your React Native app is ready to go.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeScreen;
`;

  await writeFile(
    path.join(projectPath, "src/screens", config.typescript ? "HomeScreen.tsx" : "HomeScreen.js"),
    homeScreenContent
  );

  /** Generate metro.config.js */
  const metroConfig = `const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 */
const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
`;

  await writeFile(path.join(projectPath, "metro.config.js"), metroConfig);

  /** Generate babel.config.js */
  const babelConfig = `module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
};
`;

  await writeFile(path.join(projectPath, "babel.config.js"), babelConfig);

  if (config.typescript) {
    /** Generate tsconfig.json */
    const tsConfig = {
      extends: "@react-native/typescript-config/tsconfig.json",
      compilerOptions: {
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        isolatedModules: true,
        jsx: "react-native",
        lib: ["es2017"],
        moduleResolution: "node",
        noEmit: true,
        strict: true,
        target: "esnext",
      },
      exclude: ["node_modules", "babel.config.js", "metro.config.js", "jest.config.js"],
    };

    await writeFile(path.join(projectPath, "tsconfig.json"), JSON.stringify(tsConfig, null, 2));
  }

  consola.success("React Native project structure created!");
}
