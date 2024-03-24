import React, { useRef, useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import MapView, { Polyline, PROVIDER_DEFAULT, MAP_TYPES } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.09;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Map = (props) => {
	const mapRef = useRef(null);
	const [route, setRoute] = useState([]);

	const mapBoundaries = props.cityLimits;

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
			const e2eCoordinates = props.route.flatMap((way, index) => {
				const nodes = [];
				const point1 = way.lat1 === null || way.lon1 === null ?
				{
					latitude: way.lat2,
					longitude: way.lon2,
					isCycleLane: way.isCycleLane,
				} : way.lat2 === null || way.lon2 === null ?
				{
					latitude: way.lat1,
					longitude: way.lon1,
					isCycleLane: way.isCycleLane,
				} :
				index === 0 ? {
					latitude: way.lat1,
					longitude: way.lon1,
					isCycleLane: way.isCycleLane,
				} :
					Math.abs(props.route[index - 1].lat2 - way.lat1 + props.route[index - 1].lon2 - way.lon1) <
					Math.abs(props.route[index - 1].lat2 - way.lat2 + props.route[index - 1].lon2 - way.lon2) ?
				{
					latitude: way.lat1,
					longitude: way.lon1,
					isCycleLane: way.isCycleLane,
				} :
				{
					latitude: way.lat2,
					longitude: way.lon2,
					isCycleLane: way.isCycleLane,
				};
				const point2 = point1.latitude === way.lat1 && point1.longitude === way.lon1 ?
				{
					latitude: way.lat2,
					longitude: way.lon2,
					isCycleLane: way.isCycleLane,
				} :
				{
					latitude: way.lat1,
					longitude: way.lon1,
					isCycleLane: way.isCycleLane,
				};
				if (point1.latitude && point1.longitude) {
					nodes.push(point1);
				}
				if (point2.latitude && point2.longitude) {
					nodes.push(point2);
				}
				return nodes;
			});
			setRoute(
				e2eCoordinates.reduce((ac, value, index) => {
					if (index !== 0 && e2eCoordinates[index - 1].isCycleLane === value.isCycleLane) {
						ac[ac.length - 1].push(value);
					} else {
						ac.push([value]);
					}
					return ac;
				}, [])
			);
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
			{
				route.map((segment, index) => {
					return (
						<Polyline key={index} coordinates={segment} strokeColor="#880808" strokeWidth={3} lineDashPattern={segment[0].isCycleLane ? [3] : null} />
					);
				})
			}
		</MapView>
	);
};

export default Map;
