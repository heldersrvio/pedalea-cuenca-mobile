import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import GoogleSignIn from '../GoogleSignIn';
import AppleSignIn from '../AppleSignIn';

const SignIn = (props) => {
	return (
		<View style={styles.container}>
			<GoogleSignIn />
			{Platform.OS === 'ios' ? <AppleSignIn /> : null}
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
		gap: 15,
	},
});
