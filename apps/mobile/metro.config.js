// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// AI agent/skill directories (`.claude`, `.agents`) churn rapidly as skills are
// synced, which makes Metro's file watcher throw "TreeFS: Unexpected error" /
// "Missing" errors when it tries to track files that vanish mid-operation.
// They hold no app code, so exclude them from Metro's file map entirely.
const existingBlockList = Array.isArray(config.resolver.blockList)
  ? config.resolver.blockList
  : [config.resolver.blockList].filter(Boolean);
config.resolver.blockList = [...existingBlockList, /[\\/]\.claude[\\/].*/, /[\\/]\.agents[\\/].*/];

module.exports = withUniwindConfig(config, {
  cssEntryFile: "./src/global.css",
  dtsFile: "./src/uniwind-types.d.ts",
  // NativeWind used a 14px rem base; keep it so spacing/sizing stay identical
  // (Uniwind defaults to 16px).
  polyfills: { rem: 14 },
});
