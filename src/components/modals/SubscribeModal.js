import React, { useState, useContext } from 'react';
import { Modal, StyleSheet, ActivityIndicator, Text, View, Platform } from 'react-native';
import Subscription from '../Subscription';
import SubscriptionContext from '../../contexts/SubscriptionContext';

const FREE_TRIAL_DAYS = 4;
const PRICE_ANDROID = 4.15;
const PRICE_IOS = 4.15;

const SubscribeModal = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const { hasSubscription, isSubscriptionActive } = useContext(SubscriptionContext);

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
				hasSubscription && !isSubscriptionActive ?
					<View style={styles.modalView}>
						<Text>Tu subscrición se encuentra pausada. Ve a Google Play para manejarla.</Text>
					</View>
				:
				 <View style={styles.modalView}>
					<Subscription label={`Intenta grátis por ${FREE_TRIAL_DAYS} días`} whenSubscribe={() => setIsLoading(true)} afterSubscribe={() => {
						props.setModalVisible(false);
						if (props.updateCurrentRoute) {
							props.updateCurrentRoute();
						}
					}} />
					<Text>{'\n'}</Text>
					<Text>Y después, <Text style={styles.price}>${Platform.OS === 'ios' ? PRICE_IOS : PRICE_ANDROID}</Text> mensuales. Cancelas cuando quieras.</Text>
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
