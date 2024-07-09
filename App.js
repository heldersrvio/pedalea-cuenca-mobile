import { useState, useEffect, createContext } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import Navigation from './src/components/screens/Navigation';
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
import SignInContext from './src/contexts/SignInContext';
import SubscriptionContext from './src/contexts/SubscriptionContext';
import { withIAPContext } from 'react-native-iap';
import * as SecureStore from 'expo-secure-store';
import {
	useIAP,
	flushFailedPurchasesCachedAsPendingAndroid,
	clearTransactionIOS,
} from 'react-native-iap';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const Drawer = createDrawerNavigator();

const androidSubscriptionId = 'basic_1';
const iosSubscriptionId = 'subscription_1';

const App = () => {
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [hasSubscription, setHasSubscription] = useState(false);
	const [isFreeTrialAvailable, setIsFreeTrialAvailable] = useState(false);
	const [hasLoadedSubscriptions, setHasLoadedSubscriptions] = useState(false);
	const {
		subscriptions,
		getSubscriptions,
		purchaseHistory,
		getPurchaseHistory,
	} = useIAP();

	useEffect(() => {
		const fetchSubscriptions = async () => {
			await getPurchaseHistory();
			await getSubscriptions({
				skus: [androidSubscriptionId, iosSubscriptionId],
			});
		};

		const clearCacheAndFetchSubscriptions = async () => {
			if (Platform.OS === 'android') {
				await flushFailedPurchasesCachedAsPendingAndroid();
				await fetchSubscriptions();
				await SplashScreen.hideAsync();
				setHasLoadedSubscriptions(true);
			} else {
				await SplashScreen.hideAsync();
				await clearTransactionIOS();
				await fetchSubscriptions();
				setHasLoadedSubscriptions(true);
			}
		};

		clearCacheAndFetchSubscriptions();
	}, []);

	useEffect(() => {
		if (subscriptions && subscriptions?.[0] && !isFreeTrialAvailable) {
			const subscription = subscriptions[0];
			const offerId =
				subscription?.subscriptionOfferDetails?.[0]?.offerId;

			if (offerId) {
				setIsFreeTrialAvailable(true);
			} else {
				if (
					Platform.OS === 'ios' &&
					purchaseHistory &&
					purchaseHistory?.length === 0
				) {
					setIsFreeTrialAvailable(true);
				}
			}
		}
	}, [subscriptions, purchaseHistory]);

	const signOut = async () => {
		try {
			await GoogleSignin.signOut();
			await SecureStore.deleteItemAsync('login_token');
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
			<SignInContext.Provider value={{ isSignedIn, setIsSignedIn }}>
				<SubscriptionContext.Provider
					value={{
						isSubscribed,
						setIsSubscribed,
						hasSubscription,
						setHasSubscription,
						isFreeTrialAvailable,
						setIsFreeTrialAvailable,
						hasLoadedSubscriptions,
					}}
				>
					<Drawer.Navigator
						drawerType="front"
						initialRouteName="Navegación"
						drawerContent={CustomDrawerContent}
					>
						{MenuItems.map((drawer) => {
							if (
								((drawer.needsLogIn && isSignedIn) ||
									(drawer.needsLogOut && !isSignedIn) ||
									(!drawer.needsLogIn &&
										!drawer.needsLogOut)) &&
								(!drawer.appleOnly ||
									(drawer.appleOnly && Platform.OS === 'ios'))
							) {
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
						})}
					</Drawer.Navigator>
				</SubscriptionContext.Provider>
			</SignInContext.Provider>
		</NavigationContainer>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default withIAPContext(App);
