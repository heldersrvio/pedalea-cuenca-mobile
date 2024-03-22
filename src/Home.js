import React, { useState, useRef, useEffect } from 'react';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import MapView, { UrlTile, PROVIDER_DEFAULT, MAP_TYPES } from 'react-native-maps';
import { DocumentDirectoryPath } from 'react-native-fs';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Config from 'react-native-config';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.09;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GooglePlacesInput = (props) => {
  return (
    <GooglePlacesAutocomplete
      fetchDetails={true}
	  styles={{
		textInput:{backgroundColor: '#eee',
							width: '100%' },
		container: {
			position: 'absolute',
			top: props.style.top,
			width: '100%',
			flexGrow: 0,
            flexShrink: 0
		},
		textInputContainer: {
			width: '100%',
		},
		listView: {
			position: 'absolute',
			top: 50,
			zIndex: 100,
		}
	  }}
	  enablePoweredByContainer={false}
	  placeholder={props.placeholder}
	  onPress={(data, details = null) => {
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
	  }}
	/>
  );
};

const getRouteForCoordinates = async (sLat, sLon, dLat, dLon) => {
	try {
		const url = new URL('http://10.0.2.2:8080/routing');
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
				"Accept": "application/json",
				"Content-Type": "application/json"
			}
		});
		const json = await response.json();
		console.log(json);
	} catch (err) {
		console.log(err);
	}
};

const Home = () => {
	const [sLat, setSLat] = useState(null);
	const [sLon, setSLon] = useState(null);
	const [dLat, setDLat] = useState(null);
	const [dLon, setDLon] = useState(null);
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
				mapBoundaries.southWest
			);
		}
	}, []);

	useEffect(() => {
		if (sLat && sLon && dLat && dLon) {
			getRouteForCoordinates(sLat, sLon, dLat, dLon);
		}
	}, [sLat, sLon, dLat, dLon]);

	return (
		<View style={styles.container}>
			<MapView ref={mapRef} initialRegion={
				{
					latitude: -2.8959756,
					longitude: -79.0041711,
					latitudeDelta: LATITUDE_DELTA,
					longitudeDelta: LONGITUDE_DELTA,
				}
			} provider={PROVIDER_DEFAULT} style={styles.map} mapType={MAP_TYPES.STANDARD} >
			</MapView>
			<GooglePlacesInput style={styles.startingPointSearchComponent} setLat={setSLat} setLon={setSLon} placeholder="Punto de partida" />
			<GooglePlacesInput style={styles.destinationSearchComponent} setLat={setDLat} setLon={setDLon} placeholder="Destinación" />
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
  startingPointSearchComponent: {
  	position: 'absolute',
  	top: 0,
  	left: 0,
  	right: 0,
  },
  destinationSearchComponent: {
  	position: 'absolute',
  	top: 50,
  	left: 0,
  	right: 0,
  },
});


export default Home;

