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
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
} from "@ionic/react";
import "./WelcomePage.css";
import LoginButton from "../components/Login";
import { searchOutline, heartOutline, notificationsOutline, timeOutline, pricetagOutline, thumbsUpOutline } from "ionicons/icons";

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
						Welcome to Remind Me Later
					</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen className="ion-padding welcome-content">
				<IonGrid fixed>
					<IonRow className="ion-justify-content-center ion-text-center">
						<IonCol size="12" sizeMd="8" sizeLg="6">
							<IonCard className="welcome-card ion-margin-vertical">
								{/* <IonCardHeader>
									<IonCardTitle
										color="primary"
										className="ion-padding-bottom"
									>
										<h1 className="welcome-title">
											Welcome to AI Assisted Reminder
										</h1>
									</IonCardTitle>
								</IonCardHeader> */}

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

									{/* <IonText
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
									</IonText> */}
									{/* <ion-content> */}
									<IonCard>
										<IonCardHeader>
											<IonCardTitle>Our Solution for Smarter Online Shopping</IonCardTitle>
										</IonCardHeader>

										<IonCardContent>
											<p>Tired of hunting for the best deals? Our platform does the work for you by:</p>

											<IonList>
												<IonItem>
													<IonIcon icon={searchOutline} slot="start" />
													<IonLabel>
														<strong>Scanning Multiple Sources</strong>: Aggregates deals from numerous websites in one place.
													</IonLabel>
												</IonItem>

												<IonItem>
													<IonIcon icon={heartOutline} slot="start" />
													<IonLabel>
														<strong>Personalized Recommendations</strong>: AI-powered suggestions tailored to your preferences.
													</IonLabel>
												</IonItem>

												<IonItem>
													<IonIcon icon={notificationsOutline} slot="start" />
													<IonLabel>
														<strong>Real-Time Alerts</strong>: Instant Email notifications so you never miss a great deal.
													</IonLabel>
												</IonItem>
											</IonList>

											<h2>How It Helps You</h2>

											<IonList>
												<IonItem>
													<IonIcon icon={timeOutline} slot="start" />
													<IonLabel>
														<strong>Saves Time</strong>: No need to visit multiple sites for price comparisons.
													</IonLabel>
												</IonItem>

												<IonItem>
													<IonIcon icon={pricetagOutline} slot="start" />
													<IonLabel>
														<strong>Finds the Best Deals</strong>: Only relevant, up-to-date offers.
													</IonLabel>
												</IonItem>

												<IonItem>
													<IonIcon icon={thumbsUpOutline} slot="start" />
													<IonLabel>
														<strong>Enhances Shopping</strong>: Personalized, exclusive deals matched to your interests.
													</IonLabel>
												</IonItem>
											</IonList>

											<p><strong>In short, it makes online shopping easy, efficient, and cost-effective!</strong></p>
										</IonCardContent>
									</IonCard>
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
