import React from 'react';
import { StyleSheet, View, Text, Linking } from 'react-native';

const Contact = (_props) => {
	const EMAIL_ADDRESS = 'contacto@pedaleacuenca.com';
	const TELEPHONE = '0958879836';

	return (
		<View style={styles.container}>
			<Text style={styles.contactField}>
				No dudes en enviarnos cualquier pregunta, sugerencia o queja que
				puedas tener.
			</Text>
			<View style={styles.contactField}>
				<Text style={styles.label}>Correo: </Text>
				<Text
					style={styles.link}
					onPress={() => Linking.openURL(`mailto:${EMAIL_ADDRESS}`)}
				>
					{EMAIL_ADDRESS}
				</Text>
			</View>
			<View style={styles.contactField}>
				<Text style={styles.label}>Teléfono: </Text>
				<Text
					style={styles.link}
					onPress={() => Linking.openURL(`tel:${TELEPHONE}`)}
				>
					{TELEPHONE}
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 30,
	},
	contactField: {
		display: 'flex',
		flexDirection: 'row',
		marginBottom: 15,
	},
	label: {
		fontWeight: 'bold',
	},
	link: {
		textDecorationLine: 'underline',
		color: 'blue',
	},
});

export default Contact;
