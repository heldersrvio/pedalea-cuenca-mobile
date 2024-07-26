import React, { useEffect, useState, useContext } from 'react';
import {
	Button,
	StyleSheet,
	Text,
	Platform,
	ActivityIndicator,
	View,
} from 'react-native';
import SignInContext from '../contexts/SignInContext';
import SubscriptionContext from '../contexts/SubscriptionContext';
import {
	useIAP,
	requestSubscription,
	clearTransactionIOS,
} from 'react-native-iap';
import * as SecureStore from 'expo-secure-store';
import { signInSilently } from './SignInUtils';
import * as Crypto from 'expo-crypto';

const androidSubscriptionId = 'basic_1';
const iosSubscriptionId = 'subscription_1';

const FREE_TRIAL_DAYS = 3;
const PRICE_ANDROID = 1.99;
const PRICE_IOS = 2.99;

const setUserPurchaseToken = async (purchaseToken) => {
	try {
		const authToken = await SecureStore.getItemAsync('login_token');
		const userId = await SecureStore.getItemAsync('user_id');
		if (!userId) {
			console.log('No user id found');
			return;
		}

		const url = new URL(`${process.env.API_URL}/users/${userId}`);
		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${authToken}`,
			},
			body: JSON.stringify({
				googlePurchaseToken: purchaseToken,
			}),
		});
		const json = await response.json();
		console.log(json);
	} catch (error) {
		console.log(error.message);
	}
};

const setUserAppAccountToken = async (appAccountToken) => {
	try {
		const authToken = await SecureStore.getItemAsync('login_token');
		const userId = await SecureStore.getItemAsync('user_id');
		if (!userId) {
			console.log('No user id found');
			return;
		}

		const url = new URL(`${process.env.API_URL}/users/${userId}`);
		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${authToken}`,
			},
			body: JSON.stringify({
				appleAppAccountToken: appAccountToken,
			}),
		});
		const json = await response.json();
		console.log(json);
	} catch (error) {
		console.log(error.message);
	}
};

const getUserSubscriptionStatus = async () => {
	try {
		const authToken = await SecureStore.getItemAsync('login_token');
		const userId = await SecureStore.getItemAsync('user_id');
		if (!userId) {
			console.log('No user id found');
			return;
		}

		const url = new URL(`${process.env.API_URL}/users/${userId}`);
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${authToken}`,
			},
		});
		const json = await response.json();
		return {
			status: json.isSubscriptionActive,
			exists: !!json.googlePurchaseToken || !!json.appleAppAccountToken,
		};
	} catch (error) {
		console.log(error.message);
	}
};

const Subscription = (props) => {
	const {
		connected,
		subscriptions,
		currentPurchase,
		currentPurchaseError,
		finishTransaction,
	} = useIAP();
	const { setIsSignedIn } = useContext(SignInContext);
	const {
		setIsSubscribed,
		setHasSubscription,
		isFreeTrialAvailable,
		hasLoadedSubscriptions,
	} = useContext(SubscriptionContext);
	const [appAccountToken, setAppAccountToken] = useState(null);
	const [hasRequestedSubscription, setHasRequestedSubscription] =
		useState(false);

	const pollAfterPurchase = async (
		triesRemaining = 15,
		setHasPurchased = null,
	) => {
		try {
			if (triesRemaining === 15) {
				if (setHasPurchased) {
					setHasPurchased(true);
				}
			}
			if (triesRemaining === 0) {
				return;
			}
			await new Promise((resolve) => setTimeout(resolve, 3_000));
			const { status, exists } = await getUserSubscriptionStatus();
			setIsSubscribed(status === true);
			setHasSubscription(exists === true);
			if (!status) {
				await pollAfterPurchase(triesRemaining - 1);
			} else {
				await signInSilently(setIsSignedIn, null, true);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	useEffect(() => {
		const handleFinishPurchase = async () => {
			if (
				hasRequestedSubscription &&
				currentPurchase &&
				!currentPurchaseError
			) {
				if (props.whenSubscribe) {
					props.whenSubscribe();
				}
				if (Platform.OS === 'android') {
					const purchaseToken = currentPurchase.dataAndroid
						? JSON.parse(currentPurchase.dataAndroid)?.purchaseToken
						: null;
					if (purchaseToken) {
						await setUserPurchaseToken(purchaseToken);
					} else {
						console.log('No purchase token in Android');
					}
				} else {
					if (appAccountToken) {
						await setUserAppAccountToken(appAccountToken);
					} else {
						console.log('No app account token in iOS');
					}
				}
				await finishTransaction({
					purchase: currentPurchase,
					isConsumable: false,
				});
				await pollAfterPurchase(15, props.setHasPurchased);
				if (props.afterSubscribe) {
					props.afterSubscribe();
				}
			}
		};
		try {
			handleFinishPurchase();
		} catch (error) {
			console.log(error.message);
		}
	}, [currentPurchase, currentPurchaseError]);

	const subscribe = async () => {
		try {
			setHasRequestedSubscription(true);
			if (subscriptions && subscriptions?.[0]) {
				const subscription = subscriptions[0];
				const offerToken =
					subscription?.subscriptionOfferDetails?.[0]?.offerToken;

				if (Platform.OS === 'ios') {
					await clearTransactionIOS();
				}
				const uuid = Crypto.randomUUID();
				setAppAccountToken(uuid);
				await requestSubscription({
					sku: subscription.productId,
					appAccountToken: uuid,
					...(offerToken && {
						subscriptionOffers: [
							{ sku: subscription.productId, offerToken },
						],
					}),
				});
			} else {
				console.log('No subscription found');
			}
		} catch (error) {
			console.log('Subscription error');
			console.log(error);
			setHasRequestedSubscription(false);
		}
	};

	return hasLoadedSubscriptions ? (
		<View style={styles.container}>
			{Platform.OS === 'ios' ? (
				<Text>
					Con la <Text style={styles.strong}>suscripción</Text>,
					tienes acceso ilimitado al enrutamiento y a soporte por
					correo o teléfono.
				</Text>
			) : null}
			{Platform.OS === 'ios' ? (
				<Text>
					Es mensual y cuesta{' '}
					<Text style={styles.price}>
						${Platform.OS === 'ios' ? PRICE_IOS : PRICE_ANDROID}
					</Text>{' '}
					al mes.
				</Text>
			) : null}
			{subscriptions && subscriptions?.length > 0 ? (
				<Button
					title={
						props.label
							? props.label
							: isFreeTrialAvailable
								? `Intenta gratis por ${FREE_TRIAL_DAYS} días`
								: 'Suscríbete'
					}
					onPress={subscribe}
					style={styles.button}
				/>
			) : (
				<Text>
					Suscripciones no están disponibles en este entorno. Utiliza
					una cuenta con acceso al servicio.
				</Text>
			)}
		</View>
	) : (
		<ActivityIndicator size="large" />
	);
};

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'column',
		gap: 15,
	},
	button: {
		backgroundColor: 'blue',
	},
	price: {
		fontWeight: 'bold',
		color: 'green',
	},
	strong: {
		fontWeight: 'bold',
	},
});

export default Subscription;
