import { useState, useContext } from 'react';
import SignInContext from '../contexts/SignInContext';
import {
	GoogleSignin,
	GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';
import * as SecureStore from 'expo-secure-store';

GoogleSignin.configure({
	webClientId:
		'117342559706-5a2u1ttjbvmedh7q7ke265qf9267s2e6.apps.googleusercontent.com',
	offlineAccess: false,
});

const signInToBackEnd = async (idToken) => {
	const url = new URL(`${Config.API_URL}/signin`);
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
};

const GoogleSignIn = (props) => {
	const [isSignInInProgress, setIsSignInInProgress] = useState(false);
	const { setIsSignedIn } = useContext(SignInContext);

	const signIn = async () => {
		try {
			setIsSignInInProgress(true);
			await GoogleSignin.hasPlayServices();
			const userInfo = await GoogleSignin.signIn();
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
		if (props.afterSignIn) {
			props.afterSignIn();
		}
	};

	return (
		<GoogleSigninButton onPress={signIn} disabled={isSignInInProgress} />
	);
};

export default GoogleSignIn;
