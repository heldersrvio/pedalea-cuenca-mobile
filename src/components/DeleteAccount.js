import React, { useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import SignInContext from '../contexts/SignInContext';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Button, Alert } from 'react-native';

const DeleteAccount = (props) => {
	const { setIsSignedIn } = useContext(SignInContext);

	const signOut = async () => {
		try {
			await GoogleSignin.signOut();
			await SecureStore.deleteItemAsync('login_token');
			setIsSignedIn(false);
		} catch (error) {
			console.log(error.message);
		}
	};

	const deleteUser = async () => {
		const authToken = await SecureStore.getItemAsync('login_token');
		const userId = await SecureStore.getItemAsync('user_id');
		if (!userId) {
			console.log('No user id found');
			return;
		}

		const url = new URL(`${process.env.API_URL}/users/${userId}`);
		await fetch(url, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${authToken}`,
			},
		});
	};

	const confirmDelete = () => {
		return Alert.alert(
			'¿Estás seguro?',
			'Si tienes alguna suscripción, ya no vas a poder acceder a ella.',
			[
				{
					text: 'Cancelar',
					style: 'default',
				},
				{
					text: 'Sí, eliminar',
					style: 'destructive',
					onPress: async () => {
						await deleteUser();
						await signOut();
					},
				},
			],
		);
	};

	return (
		<Button
			title={'Eliminar cuenta'}
			onPress={confirmDelete}
			color={'red'}
		/>
	);
};

export default DeleteAccount;
