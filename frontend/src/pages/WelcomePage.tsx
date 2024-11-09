/** @format */

import {
	IonContent,
	IonGrid,
	IonHeader,
	IonPage,
	IonRow,
	IonCol,
	IonText,
	IonTitle,
	IonToolbar,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardTitle,
} from "@ionic/react";
import "./WelcomePage.css";
import LoginButton from "../components/Login";

const WelcomePage: React.FC = () => {
	// const router = useIonRouter();
	// const { isAuthenticated } = useAuth0();
	// const location = useLocation();

	// useEffect(() => {
	// 	if (isAuthenticated) {
	// 		console.log("is  authenticated , redirect to home page");
	// 		if (!location.pathname.endsWith("home"))
	// 			router.push("/home", "forward", "replace");
	// 	}
	// }, [isAuthenticated, router]);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color="primary">
					<IonTitle className="ion-text-center">
						AI Assisted Reminder
					</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen className="ion-padding welcome-content">
				<IonGrid fixed>
					<IonRow className="ion-justify-content-center ion-text-center">
						<IonCol size="12" sizeMd="8" sizeLg="6">
							<IonCard className="welcome-card ion-margin-vertical">
								<IonCardHeader>
									<IonCardTitle
										color="primary"
										className="ion-padding-bottom"
									>
										<h1 className="welcome-title">
											Welcome to AI Assisted Reminder
										</h1>
									</IonCardTitle>
								</IonCardHeader>

								<IonCardContent>
									<div className="auth-buttons ion-padding-vertical">
										<LoginButton text="Log In" />
										<LoginButton text="Register" />
									</div>

									<IonText
										color="medium"
										className="ion-padding-vertical ion-margin-bottom"
									>
										<p className="auth-message">
											Please login or register to continue
										</p>
									</IonText>

									<IonText
										color="medium"
										className="description-text"
									>
										<p>
											Lorem ipsum dolor sit amet
											consectetur adipisicing elit.
											Dolorum sit error ea ut dicta odit
											sed amet voluptatem eum repellendus.
											Repellendus expedita alias sint
											molestiae tempore cupiditate hic,
											deleniti quis? Enim architecto,
											ducimus delectus voluptatum fugit
											aliquid id, adipisci hic omnis
											possimus, iste minus commodi
											quibusdam facere consequatur
											pariatur accusamus?
										</p>
									</IonText>
								</IonCardContent>
							</IonCard>
						</IonCol>
					</IonRow>
				</IonGrid>
			</IonContent>
		</IonPage>
	);
};

export default WelcomePage;
