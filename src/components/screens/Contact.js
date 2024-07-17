import React, { useContext } from 'react';
import SignInContext from '../../contexts/SignInContext';
import SubscriptionContext from '../../contexts/SubscriptionContext';
import { StyleSheet, View, Text, Linking } from 'react-native';

const Contact = (_props) => {
	const EMAIL_ADDRESS = 'contacto@pedaleacuenca.com';
	const TELEPHONE = '0958879836';
	const { isSignedIn } = useContext(SignInContext);
	const { hasSubscription, isSubscribed } = useContext(SubscriptionContext);

	return (
		<View style={styles.container}>
			<Text style={styles.contactField}>
				No dudes en enviarnos cualquier pregunta, sugerencia o queja que
				tengas.
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
			{isSignedIn && (hasSubscription || isSubscribed) ? (
				<View style={styles.contactField}>
					<Text style={styles.label}>Teléfono: </Text>
					<Text
						style={styles.link}
						onPress={() => Linking.openURL(`tel:${TELEPHONE}`)}
					>
						{TELEPHONE}
					</Text>
				</View>
			) : null}
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
