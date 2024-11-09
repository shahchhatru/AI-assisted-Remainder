/** @format */

import { createRoot } from "react-dom/client";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

const domain = "dev-n2xixj7j7tge61nc.us.auth0.com";
const clientId = "mixLsH5as8ZlXPWX7QrJISKZkSmeAov1";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
	<Auth0Provider
		domain={domain}
		clientId={clientId}
		authorizationParams={{
			redirect_uri: window.location.origin + "/home",
		}}
		cacheLocation="localstorage"
	>
		<App />
	</Auth0Provider>,
);
