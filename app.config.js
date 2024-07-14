module.exports = {
	expo: {
		name: 'Pedalea Cuenca',
		slug: 'pedaleacuenca',
		version: '1.0.0',
		orientation: 'portrait',
		icon: './assets/images/icon.png',
		userInterfaceStyle: 'light',
		platforms: ['android', 'ios'],
		assetBundlePatterns: ['**/*'],
		ios: {
			supportsTablet: false,
			googleServicesFile: './GoogleService-Info.plist',
			bundleIdentifier: 'org.serviosoftware.pedaleacuenca',
			usesAppleSignIn: true,
			splash: {
				image: './assets/images/splash_screen.png',
				resizeMode: 'cover',
				backgroundColor: '#000000',
			},
			config: {
				usesNonExemptEncryption: false,
				googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY_IOS,
			},
		},
		plugins: [
			'@react-native-google-signin/google-signin',
			'expo-secure-store',
			'@react-native-firebase/app',
			'@react-native-firebase/crashlytics',
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
				foregroundImage: './assets/images/adaptive-icon.png',
				backgroundColor: '#ffffff',
			},
			splash: {
				image: './assets/images/splash_screen.png',
				resizeMode: 'cover',
				backgroundColor: '#000000',
			},
			googleServicesFile: './google-services.json',
			package: 'org.serviosoftware.pedaleacuenca',
			config: {
				googleMaps: {
					apiKey: process.env.GOOGLE_MAPS_API_KEY_ANDROID,
				},
			},
			versionCode: 1,
			permissions: [
				'com.android.vending.BILLING',
				'android.permission.ACCESS_FINE_LOCATION',
			],
			blockedPermissions: ['FOREGROUND_SERVICE_LOCATION'],
		},
		owner: 'heldersrvio',
		extra: {
			eas: {
				projectId: 'e23e570f-c7a6-4770-baf8-70e29be6de39',
			},
		},
	},
};
