import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Account = (_props) => {
	const EMAIL_ADDRESS = 'ciclorrutas_cuenca@gmail.com';
	const TELEPHONE = '0958879836';

	return (
		<View style={styles.container}>
			<Text>
				Tu subscripción se encuentra{' '}
				<Text style={styles.activeStatus}>activa</Text>.
			</Text>
			<Text>{'\n'}</Text>
			<Text>
				Maneja la subscripción en{' '}
				<Text style={styles.strong}>
					Configuración > [tu nombre] > Subscripciones
				</Text>
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
	strong: {
		fontWeight: 'bold',
	},
});

export default Account;
