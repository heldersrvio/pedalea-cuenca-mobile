import {
	GoogleSignin,
	GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { decode } from 'base-64';
import {
	appleAuth,
	appleAuthAndroid,
} from '@invertase/react-native-apple-authentication';

global.atob = decode;

GoogleSignin.configure({
	webClientId:
		'661290148924-pvghltcakmh4cb2oesp4mtlmtg2hqgvi.apps.googleusercontent.com',
	offlineAccess: false,
});

const signInToBackEnd = async (idToken, authenticationProvider = null) => {
	const url = new URL(`${process.env.API_URL}/signin`);
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			idToken,
			authenticationProvider,
		}),
	});
	const json = await response.json();
	await SecureStore.setItemAsync('login_token', json.token);
	await SecureStore.setItemAsync('user_id', json.userId);
};

export const signIn = async (
	setIsSignInInProgress,
	setIsSignedIn,
	afterSignIn = null,
	provider = 'google',
) => {
	try {
		if (await validateToken()) {
			if (setIsSignedIn) {
				setIsSignedIn(true);
			}
			if (afterSignIn) {
				afterSignIn();
			}
			return;
		}
		setIsSignInInProgress(true);
		if (provider === 'apple') {
			if (Platform.OS === 'ios') {
				const userInfo = await appleAuth.performRequest({
					requestedOperation: appleAuth.Operation.LOGIN,
					requestedScopes: [
						appleAuth.Scope.FULL_NAME,
						appleAuth.Scope.EMAIL,
					],
				});
				await signInToBackEnd(userInfo.identityToken, 'apple');
				setIsSignInInProgress(false);
				if (setIsSignedIn) {
					setIsSignedIn(true);
				}
			} else {
				appleAuthAndroid.configure({
					clientId: 'org.serviosoftware.pedaleacuenca-android',
					redirectUri: process.env.API_URL,
					responseType: appleAuthAndroid.ResponseType.ALL,
					scope: appleAuthAndroid.Scope.ALL,
				});
				const userInfo = await appleAuthAndroid.signIn();
				await signInToBackEnd(userInfo.id_token, 'apple');
				setIsSignInInProgress(false);
				if (setIsSignedIn) {
					setIsSignedIn(true);
				}
			}
		} else {
			await GoogleSignin.hasPlayServices();
			const userInfo = await GoogleSignin.signIn({
				showPlayServicesUpdateDialog: true,
			});
			await signInToBackEnd(userInfo.idToken);
			setIsSignInInProgress(false);
			if (setIsSignedIn) {
				setIsSignedIn(true);
			}
		}
	} catch (error) {
		console.log(error.message);
		setIsSignInInProgress(false);
		if (setIsSignedIn) {
			setIsSignedIn(false);
		}
	}
	if (afterSignIn) {
		afterSignIn();
	}
};

export const signInSilently = async (
	setIsSignedIn,
	afterSignIn = null,
	force = false,
) => {
	try {
		if (!force && (await validateToken())) {
			if (setIsSignedIn) {
				setIsSignedIn(true);
			}
			if (afterSignIn) {
				afterSignIn();
			}
			return;
		}
		const userInfo = await GoogleSignin.signInSilently();
		await signInToBackEnd(userInfo.idToken);
		if (setIsSignedIn) {
			setIsSignedIn(true);
		}
	} catch (error) {
		console.log(error.message);
		if (setIsSignedIn && !force) {
			setIsSignedIn(false);
		}
	}
	if (afterSignIn) {
		afterSignIn();
	}
};

export const validateToken = async () => {
	const token = await SecureStore.getItemAsync('login_token');
	if (!token) {
		return false;
	}
	const decodedToken = jwtDecode(token);
	if (decodedToken.expiration * 1_000 < new Date().getTime() + 300) {
		return false;
	}
	return true;
};

export const verifySubscription = async (
	setIsSubscribed = null,
	setHasSubscription = null,
) => {
	const token = await SecureStore.getItemAsync('login_token');
	if (!token) {
		return false;
	}
	const decodedToken = jwtDecode(token);
	console.log(decodedToken);
	if (setIsSubscribed) {
		setIsSubscribed(decodedToken.isSubscriptionActive === true);
	}
	if (setHasSubscription) {
		setHasSubscription(
			!!decodedToken.googlePurchaseToken ||
				!!decodedToken.appleAppAccountToken,
		);
	}
	return decodedToken.isSubscriptionActive;
};
