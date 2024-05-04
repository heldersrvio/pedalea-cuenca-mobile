import {
	GoogleSignin,
	GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { decode } from 'base-64';

global.atob = decode;

GoogleSignin.configure({
	webClientId:
		'117342559706-5a2u1ttjbvmedh7q7ke265qf9267s2e6.apps.googleusercontent.com',
	offlineAccess: false,
});

const signInToBackEnd = async (idToken) => {
	const url = new URL(`${process.env.API_URL}/signin`);
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			idToken,
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
		await GoogleSignin.hasPlayServices();
		const userInfo = await GoogleSignin.signIn({
			showPlayServicesUpdateDialog: true,
		});
		await signInToBackEnd(userInfo.idToken);
		setIsSignInInProgress(false);
		if (setIsSignedIn) {
			setIsSignedIn(true);
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

export const signInSilently = async (setIsSignedIn, afterSignIn = null) => {
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
		const userInfo = await GoogleSignin.signInSilently();
		await signInToBackEnd(userInfo.idToken);
		if (setIsSignedIn) {
			setIsSignedIn(true);
		}
	} catch (error) {
		console.log(error.message);
		if (setIsSignedIn) {
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
	console.log('Found token');
	return true;
};
