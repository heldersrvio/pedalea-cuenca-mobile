import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Map from '../Map';
import MapLegend from '../MapLegend';
import RouteInput from '../RouteInput';
import SignInModal from '../modals/SignInModal';
import SubscribeModal from '../modals/SubscribeModal';

const MAP_CITY_LIMITS = {
	northEast: {
		latitude: -2.8683698,
		longitude: -78.9752444,
	},
	southWest: {
		latitude: -2.9380468,
		longitude: -79.0494328,
	},
};

const PLACES_CITY_LIMITS = {
	northEast: {
		latitude: -2.812404,
		longitude: -78.93825,
	},
	southWest: {
		latitude: -2.967732,
		longitude: -79.099612,
	},
};

const Navigation = (props) => {
	const [route, setRoute] = useState(null);
	const [startingPoint, setStartingPoint] = useState(null);
	const [destination, setDestination] = useState(null);
	const [isSignInModalVisible, setIsSignInModalVisible] = useState(false);
	const [isSubscribeModalVisible, setIsSubscribeModalVisible] =
		useState(false);

	return (
		<View style={styles.container}>
			<Map
				style={styles.map}
				cityLimits={MAP_CITY_LIMITS}
				route={route}
				startingPoint={startingPoint}
				destination={destination}
			/>
			<RouteInput
				style={styles.routeInput}
				cityLimits={PLACES_CITY_LIMITS}
				handleRoute={setRoute}
				setStartingPoint={setStartingPoint}
				setDestination={setDestination}
				enableSignInModal={() => {
					setIsSignInModalVisible(true);
				}}
				enableSubscribeModal={() => {
					setIsSubscribeModalVisible(true);
				}}
			/>
			{route !== null ? <MapLegend style={styles.mapLegend} /> : null}
			<SignInModal
				modalVisible={isSignInModalVisible}
				setModalVisible={setIsSignInModalVisible}
			/>
			<SubscribeModal
				modalVisible={isSubscribeModalVisible}
				setModalVisible={setIsSubscribeModalVisible}
			/>
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
		left: 0,
		right: 0,
		bottom: 0,
		width: '100%',
		height: '80%',
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
		minHeight: 135,
		height: '20%',
	},
	mapLegend: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		width: '100%',
	},
});

export default Navigation;
