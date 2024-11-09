/** @format */

import { Redirect, Route } from "react-router-dom";
import {
	IonApp,
	IonLoading,
	IonRouterOutlet,
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
setupIonicReact();

export default function App() {
	const { isAuthenticated, isLoading } = useAuth0();

	if (isLoading) {
		return <IonLoading>Loading...</IonLoading>;
	}

	return (
		<IonApp>
			<IonReactRouter>
				<IonRouterOutlet>
					<Route
						exact
						path="/"
						render={() => {
							return isAuthenticated ? (
								<Redirect to={"/home"} />
							) : (
								<WelcomePage />
							);
						}}
					/>
					<Route
						exact
						path="/home"
						render={() => {
							return isAuthenticated ? (
								<Home />
							) : (
								<Redirect to={"/"} />
							);
						}}
					/>
					{/* <Route>
						<Redirect to="/" />
					</Route> */}
				</IonRouterOutlet>
			</IonReactRouter>
		</IonApp>
	);
}
