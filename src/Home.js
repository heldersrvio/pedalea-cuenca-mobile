import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Map from './Map';
import RouteInput from './RouteInput';

const Home = () => {
	const [route, setRoute] = useState(null);

	return (
		<View style={styles.container}>
			<Map style={styles.map} route={route} />
			<RouteInput style={styles.routeInput} handleRoute={setRoute} />
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
		width: '100%',
		height: '100%',
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
