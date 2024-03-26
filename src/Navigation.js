import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Map from './Map';
import RouteInput from './RouteInput';

const CITY_LIMITS = {
	northEast: {
		latitude: -2.8683698,
		longitude: -78.9752444,
    },
	southWest: {
		latitude: -2.9380468,
		longitude: -79.0494328,
	},
};

const Navigation = () => {
	const [route, setRoute] = useState(null);
	const [destination, setDestination] = useState(null);

	return (
		<View style={styles.container}>
			<Map style={styles.map} cityLimits={CITY_LIMITS} route={route} destination={destination} />
			<RouteInput style={styles.routeInput} cityLimits={CITY_LIMITS} handleRoute={setRoute} setDestination={setDestination} />
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
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		backgroundColor: '#ff2e16',
		padding: 13,
	},
});

export default Navigation;
