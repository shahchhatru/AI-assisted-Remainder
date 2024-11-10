/** @format */

import { Redirect, Route } from "react-router-dom";
import {
	IonApp,
	IonIcon,
	IonLabel,
	IonLoading,
	IonRouterOutlet,
	IonTabBar,
	IonTabButton,
	IonTabs,
	setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import "./index.css";
import { useAuth0 } from "@auth0/auth0-react";
import WelcomePage from "./pages/WelcomePage";
import Home from "./pages/Home";
import { useEffect } from "react";
setupIonicReact();

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyRequests from "./pages/MyRequests";
import { home, person, list, logOut, helpOutline } from 'ionicons/icons';
import Profile from "./pages/Profile";
import HowToUsePage from "./pages/HowToUse";

export default function App() {
	const { isAuthenticated, isLoading, user, logout } = useAuth0();

	if (isLoading) {
		return <IonLoading>Loading...</IonLoading>;
	}

	useEffect(() => {
		(async () => {
			localStorage.setItem("accessTokenAuth0", user?.sub || "")
		})();
	}, [user, isAuthenticated]);

	return (
		<IonApp>
			<ToastContainer autoClose={1500} hideProgressBar={true} newestOnTop={true} />

			<IonReactRouter>
				<IonTabs>
					<IonRouterOutlet>
						<Route exact path="/" render={() => {
							return isAuthenticated ? <Redirect to="/home" /> : <WelcomePage />;
						}} />
						<Route exact path="/home" render={() => {
							return isAuthenticated ? <Home /> : <Redirect to="/" />;
						}} />
						<Route exact path="/my-requests" render={() => {
							return isAuthenticated ? <MyRequests /> : <Redirect to="/" />;
						}} />
						<Route exact path="/profile" render={() => {
							return isAuthenticated ? <Profile /> : <Redirect to="/" />;
						}} />
						<Route exact path="/how-to-use" render={() => {
							return isAuthenticated ? <HowToUsePage /> : <Redirect to="/" />;
						}} />
					</IonRouterOutlet>

					{isAuthenticated && <IonTabBar slot="bottom">
						<IonTabButton tab="home" href="/home">
							<IonIcon icon={home} />
							<IonLabel>Home</IonLabel>
						</IonTabButton>
						<IonTabButton tab="my-requests" href="/my-requests">
							<IonIcon icon={list} />
							<IonLabel>My Requests</IonLabel>
						</IonTabButton>
						<IonTabButton tab="profile" href="/profile">
							<IonIcon icon={person} />
							<IonLabel>Profile</IonLabel>
						</IonTabButton>
						<IonTabButton tab="how-to-use" href="/how-to-use">
							<IonIcon icon={helpOutline} />
							<IonLabel>How to use</IonLabel>
						</IonTabButton>

						{/* Logout button aligned to the right */}
						<IonTabButton onClick={async () => await logout({ logoutParams: { returnTo: window.location.origin } })}  >
							<IonIcon icon={logOut} color="danger" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} />
							<IonLabel>Logout</IonLabel>
						</IonTabButton>
					</IonTabBar>
					}
				</IonTabs>
			</IonReactRouter>
		</IonApp>
	);
}
