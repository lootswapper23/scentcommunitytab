const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    alias: {
      "@": "./src",
      "@components": "./src/components",
      "@screens": "./src/screens",
      "@constants": "./src/constants",
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);
