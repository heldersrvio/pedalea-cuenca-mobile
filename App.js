import { StyleSheet, View } from 'react-native';
import Navigation from './src/Navigation';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MenuItems from './src/MenuItems';
import { Ionicons } from '@expo/vector-icons';

const Drawer = createDrawerNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Drawer.Navigator
                   drawerType="front"
                   initialRouteName="Home"
                   drawerContentOptions={{
                     activeTintColor: '#e91e63',
                     itemStyle: { marginVertical: 10 },
                   }}
            >
            	{
            		MenuItems.map((drawer) => {
            			return (
            				<Drawer.Screen key={drawer.name} name={drawer.name} options={{
            					drawerIcon: () => <Ionicons name={drawer.iconName} size={24} color="black" />
            				}} component={Navigation} />
            			);
            		})
            	}
            </Drawer.Navigator>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
