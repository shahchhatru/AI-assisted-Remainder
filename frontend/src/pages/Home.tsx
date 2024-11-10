/** @format */

import { IonAvatar, IonContent, IonGrid, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import DataInputForm from "../components/DataInputForm";
import { Link } from "react-router-dom";

export default function Home() {
	const { user } = useAuth0();


	return (
		<IonPage>
			<IonHeader>
				<IonToolbar
					color="secondary"
					className=""
				>
					<IonTitle className="ion-text-center">
						{user?.nickname ? `Hello ${user?.nickname}` : ""} - You can schedule remainder here - <Link to="/how-to-use">Need Help?</Link>
					</IonTitle>
					{user?.picture && (
						<IonAvatar slot="end">
							<img
								alt={user?.nickname || "profile picture"}
								src={user?.picture}
							/>
						</IonAvatar>
					)}

				</IonToolbar>
			</IonHeader>

			<IonContent>
				<IonGrid>
					{/* <IonRow>
						<IonCol class="ion-text-end ">
							<LogoutButton />
						</IonCol>
					</IonRow> */}
				</IonGrid>
				<DataInputForm />
			</IonContent>
		</IonPage>
	);
}
