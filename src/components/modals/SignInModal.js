import React from 'react';
import {
	Modal,
	StyleSheet,
	Text,
	View,
	Platform,
	TouchableWithoutFeedback,
} from 'react-native';
import GoogleSignIn from '../GoogleSignIn';
import AppleSignIn from '../AppleSignIn';

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
			<TouchableWithoutFeedback
				onPress={() => {
					props.setModalVisible(false);
				}}
			>
				<View style={styles.modalOverlay} />
			</TouchableWithoutFeedback>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<Text>Entra con tu cuenta</Text>
					<Text>{'\n'}</Text>
					<GoogleSignIn
						afterSignIn={() => props.setModalVisible(false)}
					/>
					{Platform.OS === 'ios' ? (
						<AppleSignIn
							afterSignIn={() => props.setModalVisible(false)}
						/>
					) : null}
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
	modalOverlay: {
		position: 'absolute',
		top: 0,
		right: 0,
		left: 0,
		bottom: 0,
		backgroundColor: 'rgba(0,0,0,0)',
	},
	modalView: {
		margin: 20,
		padding: 15,
		alignItems: 'center',
		backgroundColor: 'white',
	},
});

export default SignInModal;
