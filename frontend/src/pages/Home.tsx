/** @format */

import { IonContent, IonGrid, IonPage } from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import DataInputForm from "../components/DataInputForm";

export default function Home() {
	const { user } = useAuth0();


	return (
		<IonPage>
			{/* <IonHeader>
				<IonToolbar
					color="secondary"
					className="ion-padding ion-justify-content-between"
				>
					<IonTitle className="ion-text-center">
						{user?.nickname ? `Hello ${user?.nickname}` : ""}
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
			</IonHeader> */}

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