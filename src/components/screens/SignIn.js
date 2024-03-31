import React from 'react';
import { StyleSheet, View } from 'react-native';
import GoogleSignIn from '../GoogleSignIn';

const SignIn = (props) => {
	return (
		<View style={styles.container}>
			<GoogleSignIn setIsSignedIn={props.setIsSignedIn} />
		</View>
	);
};

export default SignIn;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
