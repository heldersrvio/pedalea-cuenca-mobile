import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import GoogleSignIn from '../GoogleSignIn';

const SignInModal = (props) => {
	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={props.modalVisible}
			onRequestClose={() => {
				props.setModalVisible(false);
			}}
		>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<Text>Entra con tu cuenta Google</Text>
					<Text>{'\n'}</Text>
					<GoogleSignIn
						afterSignIn={() => props.setModalVisible(false)}
					/>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		padding: 15,
		alignItems: 'center',
		backgroundColor: 'white',
	},
});

export default SignInModal;
