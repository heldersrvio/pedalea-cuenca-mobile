import React, { useState, useRef, useEffect } from 'react';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import MapView, { UrlTile, PROVIDER_DEFAULT, MAP_TYPES } from 'react-native-maps';
import { DocumentDirectoryPath } from 'react-native-fs';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.09;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Home = () => {
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
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});


export default Home;

