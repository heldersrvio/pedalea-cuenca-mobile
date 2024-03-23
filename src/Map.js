import React, { useRef, useEffect } from 'react';
import { Dimensions } from 'react-native';
import MapView, { PROVIDER_DEFAULT, MAP_TYPES } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.09;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Map = (props) => {
	const mapRef = useRef(null);

	const mapBoundaries = {
		northEast: {
			latitude: -2.8683698,
			longitude: -78.9752444,
		},
		southWest: {
			latitude: -2.9380468,
			longitude: -79.0494328,
		},
	};

	useEffect(() => {
		if (mapRef.current) {
			mapRef.current.setMapBoundaries(
				mapBoundaries.northEast,
				mapBoundaries.southWest,
			);
		}
	}, []);

	return (
		<MapView
			ref={mapRef}
			initialRegion={{
				latitude: -2.8959756,
				longitude: -79.0041711,
				latitudeDelta: LATITUDE_DELTA,
				longitudeDelta: LONGITUDE_DELTA,
			}}
			provider={PROVIDER_DEFAULT}
			mapType={MAP_TYPES.STANDARD}
		></MapView>
	);
};

export default Map;
