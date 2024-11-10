import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonCard,
	IonCardHeader,
	IonCardTitle,
	IonCardContent,
	IonList,
	IonItem,
	IonLabel,
	IonIcon
} from '@ionic/react';
import { linkOutline, notificationsOutline, mailOutline } from 'ionicons/icons';

const HowToUsePage = () => {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>How to Use "Remind me Later"</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent>
				<IonCard>
					<IonCardHeader>
						<IonCardTitle>Getting Started</IonCardTitle>
					</IonCardHeader>
					<IonCardContent>
						Follow these simple steps to set up your deal alerts:
					</IonCardContent>

					<IonList>
						<IonItem>
							<IonIcon icon={linkOutline} slot="start" />
							<IonLabel>
								<strong>Add Your URL and Query Terms</strong>
								<p>Enter the website URL you want to monitor and specify the type of products you’re interested in (e.g., "laptop deals," "smartphone discounts").</p>
							</IonLabel>
						</IonItem>

						<IonItem>
							<IonIcon icon={notificationsOutline} slot="start" />
							<IonLabel>
								<strong>Set Notification Interval</strong>
								<p>Choose how often you want to receive updates (e.g., hourly, daily, or weekly). This interval determines when our server runs the scraping script.</p>
							</IonLabel>
						</IonItem>

						<IonItem>
							<IonIcon icon={mailOutline} slot="start" />
							<IonLabel>
								<strong>Receive Email Alerts</strong>
								<p>When matching products are found, you’ll get an email notification with the details of the best deals based on your preferences.</p>
							</IonLabel>
						</IonItem>
					</IonList>

					<IonCardContent>
						<h2>Example</h2>
						<p>For example, if you want to monitor "smartphone deals" on <strong>examplewebsite.com</strong> and set the notification interval to "daily":</p>
						<ul>
							<li>Enter <strong>examplewebsite.com</strong> as the URL.</li>
							<li>Use <strong>"smartphone deals"</strong> as your query term.</li>
							<li>Set the interval to <strong>"daily"</strong>.</li>
							<li>You’ll receive a daily email with matching products that fit your criteria.</li>
						</ul>
						<p>This way, you stay updated on the best deals without manually searching multiple sites!</p>
					</IonCardContent>
				</IonCard>
			</IonContent>
		</IonPage>
	);
};

export default HowToUsePage;
