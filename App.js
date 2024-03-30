import { useState, createContext } from 'react';
import { StyleSheet, View } from 'react-native';
import Navigation from './src/Navigation';
import { NavigationContainer } from '@react-navigation/native';
import {
	createDrawerNavigator,
	DrawerItem,
	DrawerContentScrollView,
	DrawerItemList,
} from '@react-navigation/drawer';
import MenuItems from './src/MenuItems';
import { Ionicons } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const SignInContext = createContext(null);
const Drawer = createDrawerNavigator();

export default function App() {
	const [isSignedIn, setIsSignedIn] = useState(false);

	const signOut = async () => {
		try {
			await GoogleSignin.signOut();
			setIsSignedIn(false);
		} catch (error) {
			console.log(error.message);
		}
	};

	const CustomDrawerContent = (props) => {
		return (
			<DrawerContentScrollView {...props}>
				<DrawerItemList {...props} />
				{isSignedIn ? (
					<DrawerItem
						label="Salir"
						onPress={async () => {
							await signOut();
							props.navigation.closeDrawer();
						}}
						icon={() => (
							<Ionicons name="exit" size={24} color="black" />
						)}
					/>
				) : null}
			</DrawerContentScrollView>
		);
	};

	return (
		<NavigationContainer>
			<SignInContext.Provider value={setIsSignedIn}>
				<Drawer.Navigator
					drawerType="front"
					initialRouteName="Navegación"
					drawerContent={CustomDrawerContent}
				>
					{MenuItems.map((drawer) => {
						if (
							(drawer.needsLogIn && isSignedIn) ||
							(drawer.needsLogOut && !isSignedIn) ||
							(!drawer.needsLogIn && !drawer.needsLogOut)
						) {
							if (drawer.type === 'screen') {
								return (
									<Drawer.Screen
										key={drawer.name}
										name={drawer.name}
										options={{
											drawerIcon: () => (
												<Ionicons
													name={drawer.iconName}
													size={24}
													color="black"
												/>
											),
										}}
										component={drawer.component}
										drawerContent={(props) => (
											<CustomDrawerContent
												{...props}
												signOut={signOut}
											/>
										)}
									/>
								);
							}
							return null;
						}
						return null;
					})}
				</Drawer.Navigator>
			</SignInContext.Provider>
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
