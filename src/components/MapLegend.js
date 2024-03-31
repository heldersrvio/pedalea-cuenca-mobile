import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const MapLegend = () => {
	return (
		<View style={styles.container}>
			<View style={styles.legendElement}>
				<View style={styles.cycleLaneSymbol}></View>
				<Text style={styles.legendText}>Con ciclovia</Text>
			</View>
			<View style={styles.legendElement}>
				<View style={styles.noCycleLaneSymbol}></View>
				<Text style={styles.legendText}>Sin ciclovia</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		height: '7%',
		backgroundColor: '#ffff',
		paddingLeft: 10,
		paddingRight: 10,
	},
	legendElement: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	cycleLaneSymbol: {
		width: 60,
		height: 4,
		backgroundColor: '#0e2dff',
		marginRight: 5,
	},
	noCycleLaneSymbol: {
		width: 60,
		borderStyle: 'dotted',
		borderTopWidth: 5,
		borderTopColor: '#ff9c0e',
		marginRight: 5,
	},
	legendText: {
		marginRight: 30,
	},
});

export default MapLegend;
