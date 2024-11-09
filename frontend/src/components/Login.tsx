/** @format */

import { useAuth0 } from "@auth0/auth0-react";
import { IonButton } from "@ionic/react";

const LoginButton = ({ text = "Log In" }: { text?: string }) => {
	const { user, loginWithRedirect } = useAuth0();

	return <IonButton onClick={() => loginWithRedirect()}>{text}</IonButton>;
};

export default LoginButton;
