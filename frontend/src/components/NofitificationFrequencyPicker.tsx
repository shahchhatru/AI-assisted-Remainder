/** @format */

import React, { useState } from "react";
import {
    IonCol,
    IonRow,
    IonText,
    IonDatetimeButton,
    IonModal,
    IonDatetime,
    IonItem,
    IonLabel,
    IonInput,
    IonRadioGroup,
    IonRadio,
} from "@ionic/react";

const NotificationFrequencyPicker: React.FC = () => {
	const [frequency, setFrequency] = useState<string>("daily");
	const [customDays, setCustomDays] = useState<number | string>("1");
	const [selectedTime, setSelectedTime] = useState<string>("");

	// Handle frequency change
	const handleFrequencyChange = (event: any) => {
		setFrequency(event.detail.value);
	};

	// Handle custom day input change
	const handleCustomDaysChange = (event: any) => {
		setCustomDays(event.target.value);
	};

	return (
		<IonCol>
			<IonText className="ion-padding ion-text-lg">
				How often do you want to receive notifications?
			</IonText>

			<IonCol>
				<IonRow>
					{/* Frequency Options */}
					<IonRadioGroup
						value={frequency}
						onIonChange={handleFrequencyChange}
					>
						<IonItem>
							<IonLabel>Daily</IonLabel>
							<IonRadio value="daily" />
						</IonItem>
						<IonItem>
							<IonLabel>Weekly</IonLabel>
							<IonRadio value="weekly" />
						</IonItem>
						<IonItem>
							<IonLabel>Custom</IonLabel>
							<IonRadio value="custom" />
						</IonItem>
					</IonRadioGroup>{" "}
				</IonRow>
			</IonCol>

			<IonCol>
				<IonRow>
					{/* Custom Frequency Input */}
					{frequency === "custom" && (
						<IonInput
							value={customDays}
							onIonInput={handleCustomDaysChange}
							type="number"
							placeholder="Enter interval in days"
							label="Notification interval (in days)"
							labelPlacement="floating"
							fill="outline"
                            min={1}
                            max={30}
						/>
					)}
				</IonRow>
			</IonCol>

			{/* Time Input for daily/weekly/custom */}
			<IonCol>
				<IonRow>
					<IonText className="ion-padding ion-text-lg">
						Select the time for your notifications:
					</IonText>

					{/* Time Picker Button */}
					<IonDatetimeButton datetime="time-picker" />

					{/* Modal contains the actual time picker */}
					<IonModal keepContentsMounted={true}>
						<IonDatetime
							id="time-picker"
							presentation="time"
							className="ion-margin-top"
							onIonChange={(e) =>
								setSelectedTime(
									e.target.value as unknown as string,
								)
							}
						/>
					</IonModal>
				</IonRow>
			</IonCol>
		</IonCol>
	);
};

export default NotificationFrequencyPicker;
