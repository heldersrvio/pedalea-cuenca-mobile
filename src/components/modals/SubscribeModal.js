import React, { useState } from 'react';
import { Modal, StyleSheet, ActivityIndicator, Text, View } from 'react-native';
import Subscription from '../Subscription';

const FREE_TRIAL_DAYS = 4;
const PRICE = 4.15;

const SubscribeModal = (props) => {
	const [isLoading, setIsLoading] = useState(false);

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
				{isLoading ?
					<View style={styles.modalView}>
						<ActivityIndicator size="large" />
					</View> :
				 <View style={styles.modalView}>
					<Subscription label={`Intenta grátis por ${FREE_TRIAL_DAYS} días`} whenSubscribe={() => setIsLoading(true)} afterSubscribe={() => {
						props.setModalVisible(false);
						if (props.updateCurrentRoute) {
							props.updateCurrentRoute();
						}
					}} />
					<Text>{'\n'}</Text>
					<Text>Y después, <Text style={styles.price}>${PRICE}</Text> mensuales. Cancelas cuando quieras.</Text>
				</View>}
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
		margin: 15,
		padding: 25,
		alignItems: 'center',
		backgroundColor: 'white',
	},
	price: {
		fontWeight: 'bold',
	},
});

export default SubscribeModal;
