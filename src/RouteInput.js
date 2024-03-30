import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Config from 'react-native-config';

const getRouteForCoordinates = async (sLat, sLon, dLat, dLon, handleRoute) => {
	try {
		const url = new URL(`${Config.API_URL}/routing`);
		const params = {
			startingLat: sLat,
			startingLon: sLon,
			destinationLat: dLat,
			destinationLon: dLon,
		};
		url.search = new URLSearchParams(params).toString();
		console.log(params);
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		});
		const json = await response.json();
		handleRoute(json);
	} catch (err) {
		console.log(err);
	}
};

const GooglePlacesInput = (props) => {
	return (
		<GooglePlacesAutocomplete
			fetchDetails={true}
			styles={{
				textInput: { backgroundColor: '#ffff', width: '100%' },
				container: {
					width: '100%',
					flexGrow: 0,
					flexShrink: 0,
				},
				textInputContainer: {
					width: '100%',
					marginTop: 7,
				},
				listView: {
					position: 'absolute',
					top: 41,
					zIndex: 100,
				},
			}}
			enablePoweredByContainer={false}
			placeholder={props.placeholder}
			onPress={(_data, details = null) => {
				const location = details?.geometry?.location;
				console.log(JSON.stringify(location));
				if (location) {
					props.setLat(location.lat);
					props.setLon(location.lng);
				}
			}}
			query={{
				key: Config.GOOGLE_PLACES_API_KEY,
				language: 'en',
				locationrestriction: `rectangle:${props.cityLimits.southWest.latitude},${props.cityLimits.southWest.longitude}|${props.cityLimits.northEast.latitude},${props.cityLimits.northEast.longitude}`,
			}}
		/>
	);
};

const RouteInput = (props) => {
	const [sLat, setSLat] = useState(null);
	const [sLon, setSLon] = useState(null);
	const [dLat, setDLat] = useState(null);
	const [dLon, setDLon] = useState(null);

	useEffect(() => {
		if (sLat && sLon && dLat && dLon) {
			getRouteForCoordinates(sLat, sLon, dLat, dLon, props.handleRoute);
		}
	}, [sLat, sLon, dLat, dLon]);

	useEffect(() => {
		if (dLat && dLon) {
			props.setDestination({
				latitude: dLat,
				longitude: dLon,
			});
		}
	}, [dLat, dLon]);

	return (
		<View className="route-input" style={props.style}>
			<GooglePlacesInput
				style={styles.input}
				setLat={setSLat}
				setLon={setSLon}
				placeholder="Punto de partida"
				minLength={5}
				cityLimits={props.cityLimits}
			/>
			<GooglePlacesInput
				style={styles.input}
				setLat={setDLat}
				setLon={setDLon}
				placeholder="Destinación"
				minLength={5}
				cityLimits={props.cityLimits}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	input: {
		position: 'relative',
	},
});

export default RouteInput;
