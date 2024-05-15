import { useState, useContext } from 'react';
import SignInContext from '../contexts/SignInContext';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { signIn } from './SignInUtils';

const GoogleSignIn = (props) => {
	const [isSignInInProgress, setIsSignInInProgress] = useState(false);
	const { setIsSignedIn } = useContext(SignInContext);

	return (
		<GoogleSigninButton
			onPress={async () => {
				setIsSignInInProgress(true);
				await signIn(setIsSignInInProgress, setIsSignedIn, () => {
					setIsSignInInProgress(false);
					if (props.afterSignIn) {
						props.afterSignIn();
					}
				});
			}}
			disabled={isSignInInProgress}
		/>
	);
};

export default GoogleSignIn;
