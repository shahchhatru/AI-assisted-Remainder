/** @format */

import {
	IonButton,
	IonInput,
	IonText,
	IonCard,
	IonCardContent,
	IonGrid,
	IonCol,
	IonRow,
	IonDatetimeButton,
	IonDatetime,
	IonModal,
	IonSelect,
	IonSelectOption,
} from "@ionic/react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { TasksApi } from "../API/TasksApi";
import { useAuth0 } from "@auth0/auth0-react";

export interface IForm {
	_id?: string;
	url: string;
	queryTerms: string;
	hourInterval?: number;
	daysInterval?: number;
	time?: string;
	notificationType: "Hourly" | "Days interval";
	email?: string;
}

export default function DataInputForm() {
	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<IForm>({
		defaultValues: {
			url: "",
			queryTerms: "",
			notificationType: "Days interval",
			daysInterval: 1,
			hourInterval: 1,
			time: new Date().toISOString(),
		},
	});

	const notificationType = useWatch({ control, name: "notificationType" });
	const {user} = useAuth0();

	const onSubmit = async (data: IForm) => {
		console.log(data); // handle form submission
		await TasksApi.post({...data, email: user?.email })
	};

	return (
		<IonCard style={{ width: "500px", margin: "0 auto" }}>
			<IonCardContent>
				<IonGrid>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-4"
					>
						{/* URL Input */}
						<IonCol>
							<IonRow>
								<Controller
									name="url"
									control={control}
									rules={{ required: "URL is required" }}
									render={({ field }) => (
										<IonInput
											{...field}
											onIonChange={(e) =>
												setValue(
													"url",
													e.target.value as string,
												)
											}
											className="ion-margin-top"
											label="URL"
											labelPlacement="floating"
											fill="outline"
										/>
									)}
								/>
							</IonRow>
							{errors.url && (
								<IonRow>
									<IonText color="danger" className="text-sm">
										{errors.url.message}
									</IonText>
								</IonRow>
							)}
						</IonCol>

						{/* Query Terms Input */}
						<IonCol>
							<IonRow>
								<Controller
									name="queryTerms"
									control={control}
									rules={{
										required: "Query Terms are required",
									}}
									render={({ field }) => (
										<IonInput
											{...field}
											onIonChange={(e) =>
												setValue(
													"queryTerms",
													e.target.value as string,
												)
											}
											className="ion-margin-top"
											label="Query Terms"
											labelPlacement="floating"
											fill="outline"
										/>
									)}
								/>
							</IonRow>
							{errors.queryTerms && (
								<IonRow>
									<IonText color="danger" className="text-sm">
										{errors.queryTerms.message}
									</IonText>
								</IonRow>
							)}
						</IonCol>

						{/* Notification Type Select */}
						<IonCol>
							<IonRow>
								<Controller
									name="notificationType"
									control={control}
									render={({ field }) => (
										<IonSelect
											{...field}
											onIonChange={(e) =>
												setValue(
													"notificationType",
													e.detail.value,
												)
											}
											label="Notification Interval"
											labelPlacement="floating"
											fill="outline"
										>
											<IonSelectOption value="Hourly">
												Hourly
											</IonSelectOption>
											<IonSelectOption value="Day Interval">
												Days interval
											</IonSelectOption>
										</IonSelect>
									)}
								/>
							</IonRow>
						</IonCol>

						{/* Interval Input */}
						{notificationType === "Hourly" ? (
							// Hour Interval for Hourly Notifications
							<IonCol>
								<IonRow>
									<Controller
										name="hourInterval"
										control={control}
										rules={{
											required:
												"Hour Interval is required",
											min: {
												value: 1,
												message:
													"Minimum interval is 1 hour",
											},
											max: {
												value: 24,
												message:
													"Maximum interval is 24 hours",
											},
										}}
										render={({ field }) => (
											<IonInput
												{...field}
												type="number"
												onIonChange={(e) =>
													setValue(
														"hourInterval",
														+(e.target
															.value as string),
													)
												}
												placeholder="Enter interval in hours"
												label="Notification interval (in hours)"
												labelPlacement="floating"
												fill="outline"
											/>
										)}
									/>
								</IonRow>
								{errors.hourInterval && (
									<IonRow>
										<IonText
											color="danger"
											className="text-sm"
										>
											{errors.hourInterval.message}
										</IonText>
									</IonRow>
								)}
							</IonCol>
						) : (
							// Day Interval and Time for Daily Notifications
							<>
								<IonCol>
									<IonRow>
										<Controller
											name="daysInterval"
											control={control}
											rules={{
												required:
													"Days Interval is required",
												min: {
													value: 1,
													message:
														"Minimum interval is 1 day",
												},
												max: {
													value: 30,
													message:
														"Maximum interval is 30 days",
												},
											}}
											render={({ field }) => (
												<IonInput
													{...field}
													type="number"
													onIonChange={(e) =>
														setValue(
															"daysInterval",
															+(e.target
																.value as string),
														)
													}
													placeholder="Enter interval in days"
													label="Notification interval (in days)"
													labelPlacement="floating"
													fill="outline"
												/>
											)}
										/>
									</IonRow>
									{errors.daysInterval && (
										<IonRow>
											<IonText
												color="danger"
												className="text-sm"
											>
												{errors.daysInterval.message}
											</IonText>
										</IonRow>
									)}
								</IonCol>

								{/* Time Picker for Daily Notifications */}
								<IonCol>
									<IonRow>
										<IonText className="ion-padding ion-text-lg">
											Select the time for your daily
											notifications:
										</IonText>
										<Controller
											name="time"
											control={control}
											render={({ field }) => (
												<>
													<IonDatetimeButton datetime="time-picker" />
													<IonModal
														keepContentsMounted={
															true
														}
													>
														<IonDatetime
															id="time-picker"
															presentation="time"
															className="ion-margin-top"
															onIonChange={(e) =>
																setValue(
																	"time",
																	(e.detail
																		.value as string).split("T")[1],
																)
															}
														/>
													</IonModal>
												</>
											)}
										/>
									</IonRow>
								</IonCol>
							</>
						)}

						{/* Submit Button */}
						<IonCol>
							<IonRow>
								<IonButton expand="full" type="submit">
									Submit
								</IonButton>
							</IonRow>
						</IonCol>
					</form>
				</IonGrid>
			</IonCardContent>
		</IonCard>
	);
}
