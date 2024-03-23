import { useState } from 'react';
import {
	GoogleSignin,
	GoogleSigninButton,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
	webClientId:
		'117342559706-5a2u1ttjbvmedh7q7ke265qf9267s2e6.apps.googleusercontent.com',
	offlineAccess: false,
});

const GoogleSignIn = () => {
	const [isSignInInProgress, setIsSignInInProgress] = useState(false);

	const signIn = async () => {
		try {
			setIsSignInInProgress(true);
			await GoogleSignin.hasPlayServices();
			const userInfo = await GoogleSignin.signIn();
			console.log(userInfo);
			setIsSignInInProgress(false);
		} catch (error) {
			console.log(error.message);
			setIsSignInInProgress(false);
		}
	};

	return (
		<GoogleSigninButton onPress={signIn} disabled={isSignInInProgress} />
	);
};

export default GoogleSignIn;
