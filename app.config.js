module.exports = {
	expo: {
		name: 'ciclo-cuenca-mobile',
		slug: 'ciclocuenca',
		version: '1.0.0',
		orientation: 'portrait',
		icon: './assets/icon.png',
		userInterfaceStyle: 'light',
		splash: {
			image: './assets/splash.png',
			resizeMode: 'contain',
			backgroundColor: '#ffffff',
		},
		platforms: ['android', 'ios'],
		assetBundlePatterns: ['**/*'],
		ios: {
			supportsTablet: false,
			googleServicesFile: './GoogleService-Info.plist',
			bundleIdentifier: 'org.serviosoftware.ciclocuenca',
			config: {
				usesNonExemptEncryption: false,
			},
			infoPlist: {
				NSLocationWhenInUseUsageDescription:
					'Esta aplicación utiliza tu ubicación para crear rutas desde ahí.',
			},
		},
		plugins: [
			'@react-native-google-signin/google-signin',
			[
				'react-native-permissions',
				{
					iosPermissions: [
						'LocationWhenInUse',
						'LocationAlwaysAndWhenInUse',
					],
				},
			],
			'expo-secure-store',
			'./src/plugins/withAndroidStrategies.js',
			'./src/plugins/withSupportLibVersion.js',
			[
				'expo-location',
				{
					locationWhenInUsePermission:
						'Esta aplicación utiliza tu ubicación para crear rutas desde ahí.',
					isAndroidForegroundServiceEnabled: true,
					withBlockedPermission: ['ACCESS_COARSE_LOCATION'],
				},
			],
		],
		android: {
			adaptiveIcon: {
				foregroundImage: './assets/adaptive-icon.png',
				backgroundColor: '#ffffff',
			},
			googleServicesFile: './google-services.json',
			package: 'org.serviosoftware.ciclocuenca',
			config: {
				googleMaps: {
					apiKey: process.env.GOOGLE_MAPS_API_KEY,
				},
			},
			versionCode: 1,
			permissions: [
				'com.android.vending.BILLING',
				'android.permission.ACCESS_FINE_LOCATION',
			],
		},
		owner: 'heldersrvio',
		extra: {
			eas: {
				projectId: '4426fa95-b03a-4eb0-b5fe-bb78810e9613',
			},
		},
	},
};
