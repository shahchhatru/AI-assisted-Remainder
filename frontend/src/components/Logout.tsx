/** @format */

import { useAuth0 } from "@auth0/auth0-react";
import { IonButton } from "@ionic/react";

const LogoutButton = () => {
	const { logout } = useAuth0();

	return (
		<IonButton
			onClick={() =>
				logout({ logoutParams: { returnTo: window.location.origin } })
			}
			color={"danger"}
		>
			Log Out
		</IonButton>
	);
};

export default LogoutButton;
