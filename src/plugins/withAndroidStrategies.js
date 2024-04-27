const { withAppBuildGradle } = require('@expo/config-plugins');

const withAndroidStrategiesPlugin = (config) => {
	return withAppBuildGradle(config, (config) => {
		config.modResults.contents +=
			'\nandroid { defaultConfig { missingDimensionStrategy "store", "play" } }';
		return config;
	});
};

module.exports = withAndroidStrategiesPlugin;
