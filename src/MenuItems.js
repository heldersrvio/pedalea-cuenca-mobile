import Navigation from './Navigation';
import SignIn from './SignIn';

export default [
	{
		name: 'Navegación',
		iconType: 'Ionicons',
		iconName: 'navigate-sharp',
		needsLogIn: false,
		needsLogOut: false,
		component: Navigation,
		type: 'screen',
	},
	//	{
	//		name: 'Cuenta',
	//		iconType: 'Ionicons',
	//		iconName: 'person',
	//		needsLogIn: true,
	//		needsLogOut: false,
	//	},
	{
		name: 'Entrar',
		iconType: 'Ionicons',
		iconName: 'enter',
		needsLogIn: false,
		needsLogOut: true,
		component: SignIn,
		type: 'screen',
	},
	{
		name: 'Salir',
		iconType: 'Ionicons',
		iconName: 'exit',
		needsLogIn: true,
		needsLogOut: false,
		component: null,
		type: 'item',
	},
];
