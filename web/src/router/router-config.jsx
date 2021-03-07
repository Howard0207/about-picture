import Loadable from "react-loadable";
import Loading from "_components/loading";

const Compress = Loadable({
	loader: () => import(/* webpackPrefetch: true */ "../view/picture/compress"),
	loading: Loading("loadable-loading__page"),
});

// const ElectricalOverview = Loadable({
// 	loader: () => import(/* webpackPrefetch: true */ "../view/primary-electrical-overview"),
// 	loading: Loading("loadable-loading__page"),
// });

const Book = Loadable({
	loader: () => import(/* webpackPrefetch: true */ "../view/book"),
	loading: Loading("loadable-loading__page"),
});

const NotFound = Loadable({
	loader: () => import(/* webpackPrefetch: true */ "../view/404"),
	loading: Loading("loadable-loading__page"),
});

const Login = Loadable({
	loader: () => import(/* webpackPrefetch: true */ "../view/login"),
	loading: Loading("loadable-loading__app"),
});

const Main = Loadable({
	loader: () => import(/* webpackPrefetch: true */ "../view/main"),
	loading: Loading("loadable-loading__app"),
});

const RichText = Loadable({
	loader: () => import(/* webpackPrefetch: true */ "../view/richtext"),
	loading: Loading("loadable-loading__app"),
});

const routes = [
	{
		path: "/login",
		exact: true,
		component: Login,
	},
	{
		path: "/",
		component: Main,
		routes: [
			{
				path: "/",
				exact: true,
				component: Compress,
			},
			// {
			//     path: "/electrical-overview",
			//     exact: true,
			//     component: ElectricalOverview,
			// },
			{
				path: "/book",
				exact: true,
				component: Book,
			},
			{
				path: "/richtext",
				exact: true,
				component: RichText,
			},
			{
				path: "*",
				component: NotFound,
			},
		],
	},
];

export default routes;
