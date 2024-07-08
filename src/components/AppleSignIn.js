import { useState, useContext } from 'react';
import SignInContext from '../contexts/SignInContext';
import { AppleButton } from '@invertase/react-native-apple-authentication';
import { signIn } from './SignInUtils';

const AppleSignIn = (props) => {
	const [isSignInInProgress, setIsSignInInProgress] = useState(false);
	const { setIsSignedIn } = useContext(SignInContext);

	return (
		<AppleButton
			buttonStyle={AppleButton.Style.BLACK}
			buttonType={AppleButton.Type.SIGN_IN}
			buttonText={'Acceder con Apple'}
			style={{
				width: 225,
				height: 45,
			}}
			onPress={async () => {
				if (!isSignInInProgress) {
					setIsSignInInProgress(true);
					await signIn(
						setIsSignInInProgress,
						setIsSignedIn,
						() => {
							setIsSignInInProgress(false);
							if (props.afterSignIn) {
								props.afterSignIn();
							}
						},
						'apple',
					);
				}
			}}
		/>
	);
};

export default AppleSignIn;
