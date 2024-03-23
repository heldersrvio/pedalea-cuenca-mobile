import React, { useRef, useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import MapView, { Polyline, PROVIDER_DEFAULT, MAP_TYPES } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.09;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Map = (props) => {
	const mapRef = useRef(null);
	const [coordinates, setCoordinates] = useState([]);

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

	useEffect(() => {
		if (props.route) {
			setCoordinates(props.route.flatMap((way) => {
				const nodes = [];
				if (way.lat2 && way.lon2) {
					nodes.push({
						latitude: way.lat2,
						longitude: way.lon2,
					});
				}
				if (way.lat1 && way.lon1) {
					nodes.push({
						latitude: way.lat1,
						longitude: way.lon1
					});
				}
				return nodes;
			}));
		}
	}, [props.route]);

//	useEffect(() => {
//		console.log(coordinates);
//	}, [coordinates]);

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
			style={props.style}
		>
			<Polyline coordinates={coordinates} strokeColor="#880808" strokeWidth={3} />
		</MapView>
	);
};

export default Map;
