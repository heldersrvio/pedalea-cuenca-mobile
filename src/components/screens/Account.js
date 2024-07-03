import React, { useState, useEffect, useContext } from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import SignInContext from '../../contexts/SignInContext';
import SubscriptionContext from '../../contexts/SubscriptionContext';
import Subscription from '../Subscription';
import { signInSilently } from '../SignInUtils';
import * as SecureStore from 'expo-secure-store';

const Account = (_props) => {
	const EMAIL_ADDRESS = 'ciclorrutas_cuenca@gmail.com';
	const TELEPHONE = '0958879836';

	const [hasPurchased, setHasPurchased] = useState(false);
	const { setIsSignedIn } = useContext(SignInContext);
	const {
		isSubscribed,
		hasSubscription,
		setIsSubscribed,
		setHasSubscription,
	} = useContext(SubscriptionContext);

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
		setIsSubscribed(json.isSubscriptionActive === true);
		setHasSubscription(
			!!json.googlePurchaseToken || !!json.appleAppAccountToken,
		);
		return {
			status: json.isSubscriptionActive,
			exists: !!json.googlePurchaseToken || !!json.appleAppAccountToken,
		};
	};

	useEffect(() => {
		getUserSubscriptionStatus();
	}, []);

	return (
		<View style={styles.container}>
			{isSubscribed !== null && isSubscribed !== undefined ? (
				!isSubscribed && hasPurchased ? (
					<Text>
						Estamos procesando tu suscripción. Es probable que esté
						lista en unos minutos.
					</Text>
				) : (
					<Text>
						Tu suscripción está{' '}
						{isSubscribed ? (
							<Text style={styles.activeStatus}>activa</Text>
						) : (
							<Text style={styles.inactiveStatus}>inactiva</Text>
						)}
						.
					</Text>
				)
			) : null}
			{isSubscribed === false && !hasPurchased && !hasSubscription ? (
				<Text>{'\n'}</Text>
			) : null}
			{isSubscribed === false && !hasPurchased && !hasSubscription ? (
				<Subscription setHasPurchased={setHasPurchased} />
			) : null}
			<Text>{'\n'}</Text>
			{hasSubscription ? (
				<Text>
					Maneja la suscripción en{' '}
					{Platform.OS === 'ios' ? (
						<Text style={styles.strong}>
							Configuración > [tu nombre] > Suscripciones
						</Text>
					) : (
						<Text style={styles.strong}>
							Google Play > [ícono de cuenta] > Pagos y
							suscripciones > Suscripciones
						</Text>
					)}
					.
				</Text>
			) : null}
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
