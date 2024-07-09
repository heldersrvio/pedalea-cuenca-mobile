import React from 'react';
import { StyleSheet, View, Text, Linking } from 'react-native';

const UseAndPrivacy = (_props) => {
	const PRIVACY_POLICY_URL = 'https://www.pedaleacuenca.com/privacy';
	const TERMS_OF_USE_URL =
		'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';

	return (
		<View style={styles.container}>
			<Text>
				Con los siguientes enlaces, puedes ver nuestros términos de uso
				y política de privacidad.
			</Text>
			<Text>{'\n'}</Text>
			<View style={styles.linksContainer}>
				<Text
					style={styles.link}
					onPress={() => Linking.openURL(TERMS_OF_USE_URL)}
				>
					{'Términos de uso (inglés)'}
				</Text>
				<Text
					style={styles.link}
					onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
					onPress={() =>
						Linking.openURL('https://www.pedaleacuenca.com/privacy')
					}
				>
					{'Política de privacidad'}
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 30,
	},
	linksContainer: {
		display: 'flex',
		flexDirection: 'column',
		gap: 10,
	},
	link: {
		textDecorationLine: 'underline',
		color: 'blue',
	},
});

export default UseAndPrivacy;
