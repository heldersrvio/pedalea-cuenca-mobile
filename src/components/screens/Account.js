import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import Subscription from '../Subscription';
import * as SecureStore from 'expo-secure-store';

const Account = (_props) => {
	const EMAIL_ADDRESS = 'ciclorrutas_cuenca@gmail.com';
	const TELEPHONE = '0958879836';

	const [isSubscriptionActive, setIsSubscriptionActive] = useState(null);
	const [hasPurchased, setHasPurchased] = useState(false);

	const pollAfterPurchase = async (triesRemaining = 5) => {
		if (triesRemaining === 5) {
			setHasPurchased(true);
		}
		if (triesRemaining === 0) {
			return;
		}
		await new Promise((resolve) => setTimeout(resolve, 3_000));
		const status = await getUserSubscriptionStatus();
		if (!status) {
			await pollAfterPurchase(triesRemaining - 1);
		}
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
		setIsSubscriptionActive(json.isSubscriptionActive);
		return json.isSubscriptionActive;
	};

	useEffect(() => {
		getUserSubscriptionStatus();
	}, []);

	return (
		<View style={styles.container}>
			{isSubscriptionActive !== null &&
			isSubscriptionActive !== undefined ? (
				!isSubscriptionActive && hasPurchased ? (
					<Text>Estamos procesando tu suscripción.</Text>
				) : (
					<Text>
						Tu suscripción se encuentra{' '}
						{isSubscriptionActive ? (
							<Text style={styles.activeStatus}>activa</Text>
						) : (
							<Text style={styles.inactiveStatus}>inactiva</Text>
						)}
						.
					</Text>
				)
			) : null}
			{isSubscriptionActive === false && !hasPurchased ? (
				<Text>{'\n'}</Text>
			) : null}
			{isSubscriptionActive === false && !hasPurchased ? (
				<Subscription onFinalizeTransaction={pollAfterPurchase} />
			) : null}
			<Text>{'\n'}</Text>
			<Text>
				Maneja la suscripción en{' '}
				{Platform.OS === 'ios' ? null : (
					<Text style={styles.strong}>
						Google Play > [ícono de cuenta] > Pagos y suscripciones
						> Suscripciones
					</Text>
				)}
				.
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 30,
	},
	activeStatus: {
		fontWeight: 'bold',
		color: 'green',
	},
	inactiveStatus: {
		fontWeight: 'bold',
		color: 'red',
	},
	strong: {
		fontWeight: 'bold',
	},
});

export default Account;
