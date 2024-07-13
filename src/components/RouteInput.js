import React, { useState, useEffect, useRef, useContext } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import SignInContext from '../contexts/SignInContext';
import SubscriptionContext from '../contexts/SubscriptionContext';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';
import { signInSilently, verifySubscription } from './SignInUtils';

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
		if (!json.error) {
			handleRoute(json);
		}
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
					props.setCoords({
						lat: location.lat,
						lon: location.lng,
					});
				}
			}}
			currentLocation={props.currentLocation}
			currentLocationLabel={'Ubicación actual'}
			nearbyPlacesAPI={'None'}
			query={{
				key:
					Platform.OS === 'ios'
						? process.env.GOOGLE_MAPS_API_KEY_IOS
						: process.env.GOOGLE_MAPS_API_KEY_ANDROID,
				language: 'en',
				locationrestriction: `rectangle:${props.cityLimits.southWest.latitude},${props.cityLimits.southWest.longitude}|${props.cityLimits.northEast.latitude},${props.cityLimits.northEast.longitude}`,
			}}
			GoogleReverseGeoCodingQuery={null}
		/>
	);
};

const RouteInput = (props) => {
	const [sCoords, setSCoords] = useState(null);
	const [dCoords, setDCoords] = useState(null);
	const startingRef = useRef(null);
	const destinationRef = useRef(null);
	const [locationStatus, requestPermission] =
		Location.useForegroundPermissions();
	const { isSignedIn, setIsSignedIn } = useContext(SignInContext);
	const { isSubscribed, setHasSubscription } =
		useContext(SubscriptionContext);

	const handleCoordinatesIfSignedIn = async () => {
		try {
			if (await verifySubscription(null, setHasSubscription)) {
				getRouteForCoordinates(
					sCoords?.lat,
					sCoords?.lon,
					dCoords?.lat,
					dCoords?.lon,
					props.handleRoute,
				);
			} else {
				await signInSilently(setIsSignedIn, null, true);
				if (await verifySubscription(null, setHasSubscription)) {
					getRouteForCoordinates(
						sCoords?.lat,
						sCoords?.lon,
						dCoords?.lat,
						dCoords?.lon,
						props.handleRoute,
					);
				} else if (props.enableSubscribeModal) {
					props.enableSubscribeModal();
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	useEffect(() => {
		const handleCoordinates = async () => {
			try {
				if (sCoords?.lat && sCoords?.lon && dCoords?.lat && dCoords?.lon) {
					if (isSignedIn) {
						await handleCoordinatesIfSignedIn();
					} else {
						if (props.enableSignInModal) {
							props.enableSignInModal();
						}
					}
				}
			} catch (error) {
				console.log(error.message);
			}
		};

		handleCoordinates();
	}, [sCoords, dCoords]);

	useEffect(() => {
		if (dCoords?.lat && dCoords?.lon) {
			props.setDestination({
				latitude: dCoords?.lat,
				longitude: dCoords?.lon,
			});
		}
	}, [dCoords]);

	useEffect(() => {
		if (sCoords?.lat && sCoords?.lon) {
			props.setStartingPoint({
				latitude: sCoords?.lat,
				longitude: sCoords?.lon,
			});
		}
	}, [sCoords]);

	useEffect(() => {
		const checkLocationPermission = async () => {
			try {
				if (locationStatus === null) {
					await requestPermission();
				}
			} catch (error) {
				console.log(error.message);
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
			setSCoords(null);
			setDCoords(null);
			props.setStartingPoint(null);
			props.setDestination(null);
			props.handleRoute(null);
			startingRef.current?.setAddressText('');
			destinationRef.current?.setAddressText('');
		} else if (
			sCoords?.lat &&
			sCoords?.lon &&
			dCoords?.lat &&
			dCoords?.lon
		) {
			handleCoordinatesIfSignedIn();
		}
	}, [isSignedIn, isSubscribed]);

	return (
		<View className="route-input" style={props.style}>
			<View
				style={{
					...styles.inputContainer,
					zIndex: styles.inputContainer.zIndex + 100,
				}}
			>
				<GooglePlacesInput
					autocompleteRef={startingRef}
					style={styles.input}
					setCoords={setSCoords}
					placeholder="Ubicación de partida"
					minLength={5}
					cityLimits={props.cityLimits}
					currentLocation={locationStatus?.granted === true}
				/>
			</View>
			<View style={styles.inputContainer}>
				<GooglePlacesInput
					autocompleteRef={destinationRef}
					style={styles.input}
					setCoords={setDCoords}
					placeholder="Destino"
					minLength={5}
					cityLimits={props.cityLimits}
					currentLocation={false}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	input: {
		position: 'relative',
	},
	inputContainer: {
		zIndex: 1000,
		height: '50%',
		width: '100%',
	},
});

export default RouteInput;
