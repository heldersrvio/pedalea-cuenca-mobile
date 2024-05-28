import React, { useEffect, useState, useContext } from 'react';
import { Button, StyleSheet, Text, Platform } from 'react-native';
import SignInContext from '../contexts/SignInContext';
import SubscriptionContext from '../contexts/SubscriptionContext';
import {
	useIAP,
	requestSubscription,
	flushFailedPurchasesCachedAsPendingAndroid,
	clearTransactionIOS,
} from 'react-native-iap';
import * as SecureStore from 'expo-secure-store';
import { signInSilently } from './SignInUtils';
import * as Crypto from 'expo-crypto';

const androidSubscriptionId = 'basic_1';
const iosSubscriptionId = 'app_subscription_1';

const FREE_TRIAL_DAYS = 3;

const setUserPurchaseToken = async (purchaseToken) => {
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
};

const setUserAppAccountToken = async (appAccountToken) => {
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
};

const getUserSubscriptionStatus = async () => {
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
};

const Subscription = (props) => {
	const {
		connected,
		subscriptions,
		currentPurchase,
		currentPurchaseError,
		finishTransaction,
		getSubscriptions,
		purchaseHistory,
		getPurchaseHistory,
	} = useIAP();
	const { setIsSignedIn } = useContext(SignInContext);
	const { setIsSubscribed, setHasSubscription, isFreeTrialAvailable, setIsFreeTrialAvailable } =
		useContext(SubscriptionContext);
	const [appAccountToken, setAppAccountToken] = useState(null);
	const [hasRequestedSubscription, setHasRequestedSubscription] =
		useState(false);

	const pollAfterPurchase = async (
		triesRemaining = 5,
		setHasPurchased = null,
	) => {
		if (triesRemaining === 5) {
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
	};

	useEffect(() => {
		const clearCacheAndFetchSubscriptions = async () => {
			if (Platform.OS === 'android') {
				await flushFailedPurchasesCachedAsPendingAndroid();
			} else {
				await clearTransactionIOS();
			}
			await getPurchaseHistory();
			await getSubscriptions({
				skus: [androidSubscriptionId, iosSubscriptionId],
			});
		};

		clearCacheAndFetchSubscriptions();
	}, []);

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

		handleFinishPurchase();
	}, [currentPurchase, currentPurchaseError]);

	useEffect(() => {
		if (subscriptions && subscriptions?.[0] && !isFreeTrialAvailable) {
			const subscription = subscriptions[0];
			const offerId = subscription?.subscriptionOfferDetails?.[0]?.offerId;

			if (offerId) {
				setIsFreeTrialAvailable(true);
			} else {
				if (Platform.OS === 'ios' && purchaseHistory && purchaseHistory?.length === 0) {
					setIsFreeTrialAvailable(true);
				}
			}
		}
	}, [subscriptions, purchaseHistory]);

	const subscribe = async () => {
		try {
			setHasRequestedSubscription(true);
			if (subscriptions && subscriptions?.[0]) {
				const subscription = subscriptions[0];
				const offerToken =
					subscription?.subscriptionOfferDetails?.[0]?.offerToken;

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

	return (
		<Button
			title={props.label ? props.label : isFreeTrialAvailable ? `Intenta grátis por ${FREE_TRIAL_DAYS} días` : 'Suscríbete'}
			onPress={subscribe}
			style={styles.button}
		/>
	);
};

const styles = StyleSheet.create({
	button: {
		backgroundColor: 'blue',
	},
});

export default Subscription;
