import Navigation from './components/screens/Navigation';
import SignIn from './components/screens/SignIn';
import Contact from './components/screens/Contact';
import Account from './components/screens/Account';

export default [
	{
		name: 'Navegación',
		iconType: 'Ionicons',
		iconName: 'navigate-sharp',
		needsLogIn: false,
		needsLogOut: false,
		component: Navigation,
	},
	{
		name: 'Cuenta',
		iconType: 'Ionicons',
		iconName: 'person',
		needsLogIn: true,
		needsLogOut: false,
		component: Account,
	},
	{
		name: 'Entrar',
		iconType: 'Ionicons',
		iconName: 'enter',
		needsLogIn: false,
		needsLogOut: true,
		component: SignIn,
	},
	{
		name: 'Contacto',
		component: Contact,
		iconType: 'Ionicons',
		iconName: 'chatbubbles-sharp',
		needsLogIn: false,
		needsLogOut: false,
	},
];
