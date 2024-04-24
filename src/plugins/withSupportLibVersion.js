const { withProjectBuildGradle } = require('@expo/config-plugins');

const withSupportLibVersionPlugin = (config) => {
  return withProjectBuildGradle(config, (config) => {
    config.modResults.contents +=
      '\nbuildscript { ext { supportLibVersion = "28.0.0" } }\n';
    return config;
  });
};

module.exports = withSupportLibVersionPlugin;