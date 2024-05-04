import React, { useState, useEffect, useRef, useContext } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import SignInContext from '../contexts/SignInContext';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';
import { signInSilently } from './SignInUtils';

Location.installWebGeolocationPolyfill();

const getRouteForCoordinates = async (sLat, sLon, dLat, dLon, handleRoute) => {
	try {
		const url = new URL(`${process.env.API_URL}/routing`);
		const params = {
			startingLat: sLat,
			startingLon: sLon,
			destinationLat: dLat,
			destinationLon: dLon,
		};
		url.search = new URLSearchParams(params).toString();
		console.log(params);
		const token = await SecureStore.getItemAsync('login_token');
		if (!token) {
			console.log('User not logged in');
			return;
		}
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
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
			ref={props.autocompleteRef}
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
					paddingTop: 9,
					paddingBottom: 9,
					backgroundColor: 'white',
				},
			}}
			enablePoweredByContainer={false}
			enableHighAccuracyLocation={true}
			placeholder={props.placeholder}
			onPress={(_data, details = null) => {
				const location = details?.geometry?.location;
				console.log(JSON.stringify(location));
				if (location) {
					props.setLat(location.lat);
					props.setLon(location.lng);
				}
			}}
			currentLocation={props.currentLocation}
			currentLocationLabel={'Ubicación actual'}
			nearbyPlacesAPI={'None'}
			query={{
				key: process.env.GOOGLE_PLACES_API_KEY,
				language: 'en',
				locationrestriction: `rectangle:${props.cityLimits.southWest.latitude},${props.cityLimits.southWest.longitude}|${props.cityLimits.northEast.latitude},${props.cityLimits.northEast.longitude}`,
			}}
			GoogleReverseGeoCodingQuery={null}
		/>
	);
};

const RouteInput = (props) => {
	const [sLat, setSLat] = useState(null);
	const [sLon, setSLon] = useState(null);
	const [dLat, setDLat] = useState(null);
	const [dLon, setDLon] = useState(null);
	const startingRef = useRef(null);
	const destinationRef = useRef(null);
	const [locationStatus, requestPermission] = Location.useForegroundPermissions();
	const { isSignedIn, setIsSignedIn } = useContext(SignInContext);

	useEffect(() => {
		if (sLat && sLon && dLat && dLon) {
			if (isSignedIn) {
				getRouteForCoordinates(
					sLat,
					sLon,
					dLat,
					dLon,
					props.handleRoute,
				);
			} else {
				if (props.enableSignInModal) {
					props.enableSignInModal();
				}
			}
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

	useEffect(() => {
		if (sLat && sLon) {
			props.setStartingPoint({
				latitude: sLat,
				longitude: sLon,
			});
		}
	}, [sLat, sLon]);

	useEffect(() => {
		const checkLocationPermission = async () => {
			if (locationStatus === null) {
				await requestPermission();
			}
		};
		checkLocationPermission();
	}, [locationStatus]);

	useEffect(() => {
		const logIn = async () => {
			if (!isSignedIn) {
            	await signInSilently(setIsSignedIn);
            }
		};
		logIn();
	}, []);

	useEffect(() => {
		if (!isSignedIn) {
			setSLat(null);
			setSLon(null);
			setDLat(null);
			setDLon(null);
			props.setStartingPoint(null);
			props.setDestination(null);
			props.handleRoute(null);
			startingRef.current?.setAddressText('');
			destinationRef.current?.setAddressText('');
		} else if (sLat && sLon && dLat && dLon) {
			getRouteForCoordinates(
				sLat,
				sLon,
				dLat,
				dLon,
				props.handleRoute,
			);
		}
	}, [isSignedIn]);

	return (
		<View className="route-input" style={props.style}>
			<GooglePlacesInput
				autocompleteRef={startingRef}
				style={styles.input}
				setLat={setSLat}
				setLon={setSLon}
				placeholder="Punto de partida"
				minLength={5}
				cityLimits={props.cityLimits}
				currentLocation={locationStatus?.granted === true}
			/>
			<GooglePlacesInput
				autocompleteRef={destinationRef}
				style={styles.input}
				setLat={setDLat}
				setLon={setDLon}
				placeholder="Destinación"
				minLength={5}
				cityLimits={props.cityLimits}
				currentLocation={false}
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
