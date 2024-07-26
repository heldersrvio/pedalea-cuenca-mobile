import React, { useState, useContext } from 'react';
import {
	Modal,
	StyleSheet,
	ActivityIndicator,
	Text,
	View,
	Platform,
	TouchableWithoutFeedback,
} from 'react-native';
import Subscription from '../Subscription';
import SubscriptionContext from '../../contexts/SubscriptionContext';

const FREE_TRIAL_DAYS = 3;
const PRICE_ANDROID = 1.99;
const PRICE_IOS = 2.99;

const SubscribeModal = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const { hasSubscription, isSubscriptionActive, isFreeTrialAvailable } =
		useContext(SubscriptionContext);

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
				{isLoading ? (
					<View style={styles.modalView}>
						<ActivityIndicator size="large" />
					</View>
				) : hasSubscription && !isSubscriptionActive ? (
					<View style={styles.modalView}>
						<Text>
							Tu suscripción está pausada. Ve a App Store o a
							Google Play para manejarla.
						</Text>
					</View>
				) : (
					<View style={styles.modalView}>
						<Subscription
							label={
								isFreeTrialAvailable
									? `Intenta gratis por ${FREE_TRIAL_DAYS} días`
									: 'Suscríbete'
							}
							whenSubscribe={() => setIsLoading(true)}
							afterSubscribe={() => {
								props.setModalVisible(false);
								if (props.updateCurrentRoute) {
									props.updateCurrentRoute();
								}
							}}
						/>
						<Text>{'\n'}</Text>
						<Text>
							{Platform.OS === 'android' ? (
								isFreeTrialAvailable ? (
									<Text>
										{'Y después, '}
										<Text style={styles.price}>
											${`${PRICE_ANDROID}`}
										</Text>
										{' al mes. '}
									</Text>
								) : (
									<Text>
										<Text style={styles.price}>
											${`${PRICE_ANDROID}`}
										</Text>
										{' al mes. '}
									</Text>
								)
							) : null}
							Cancelas cuando quieras.
						</Text>
					</View>
				)}
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
