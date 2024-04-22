import React, { useEffect } from 'react';
import { Button, StyleSheet, Text } from 'react-native';
import {
	useIAP,
	requestSubscription,
	flushFailedPurchasesCachedAsPendingAndroid,
} from 'react-native-iap';
import * as SecureStore from 'expo-secure-store';

const androidSubscriptionId = 'basic_1';

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

const Subscription = (props) => {
	const {
		connected,
		subscriptions,
		currentPurchase,
		currentPurchaseError,
		finishTransaction,
		getSubscriptions,
	} = useIAP();

	useEffect(() => {
		const fetchSubscriptions = async () => {
			await getSubscriptions({
				skus: [androidSubscriptionId],
			});
		};

		flushFailedPurchasesCachedAsPendingAndroid();
		fetchSubscriptions();
	}, []);

	useEffect(() => {
		const handleFinishPurchase = async () => {
			if (currentPurchase && !currentPurchaseError) {
				const purchaseToken = currentPurchase.dataAndroid
					? JSON.parse(currentPurchase.dataAndroid)?.purchaseToken
					: null;
				if (purchaseToken) {
					await setUserPurchaseToken(purchaseToken);
				} else {
					console.log('No purchase token in Android');
				}
				await finishTransaction({
					purchase: currentPurchase,
					isConsumable: false,
				});
				if (props.onFinalizeTransaction) {
					await props.onFinalizeTransaction();
				}
			}
		};

		handleFinishPurchase();
	}, [currentPurchase, currentPurchaseError]);

	const subscribe = async () => {
		try {
			if (subscriptions && subscriptions?.[0]) {
				const subscription = subscriptions[0];
				const offerToken =
					subscription?.subscriptionOfferDetails?.[0]?.offerToken;

				await requestSubscription({
					sku: subscription.productId,
					...(offerToken && {
						subscriptionOffers: [
							{ sku: subscription.productId, offerToken },
						],
					}),
				});
			}
		} catch (error) {
			console.log('Subscription error');
			console.log(error);
		}
	};

	return (
		<Button
			title="Suscríbete"
			onPress={() => subscribe()}
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
