import React from 'react';
import { StyleSheet, View } from 'react-native';
import Map from './Map';
import RouteInput from './RouteInput';

const Home = () => {
	return (
		<View style={styles.container}>
			<Map style={styles.map} />
			<RouteInput style={styles.routeInput} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'flex-end',
		alignItems: 'center',
		backgroundColor: 'black',
	},
	map: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	routeInput: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
	},
});

export default Home;
