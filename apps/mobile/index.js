import { registerRootComponent } from "expo";

import App from "./src/App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App).
// A local entry file (instead of expo/AppEntry.js) is required in a monorepo,
// where expo is hoisted to the root node_modules.
registerRootComponent(App);
