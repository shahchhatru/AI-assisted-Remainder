/** @format */
import {
    IonButton,
    IonInput,
    IonDatetime,
    IonText,
    IonCard,
    IonCardContent,
    IonModal,
    IonDatetimeButton,
    IonGrid,
    IonCol,
    IonRow,
} from "@ionic/react";
import { useForm, Controller } from "react-hook-form";

interface IForm {
	url: string;
	queryTerms: string;
	time: string;
}

export default function DataInputForm() {
	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({
		defaultValues: {
			url: "",
			queryTerms: "",
			time: new Date().toISOString(),
		},
	});

	const onSubmit = (data: IForm) => {
		console.log(data); // handle form submission
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
							<IonRow class=" ">
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
													e.target
														.value as unknown as string,
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
						</IonCol>
						<IonCol>
							<IonRow class=" ">
								{errors.url && (
									<IonText color="danger" className="text-sm">
										{errors.url.message}
									</IonText>
								)}
							</IonRow>
						</IonCol>
						<IonCol>
							<IonRow>
								{/* Query Terms Input */}
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
													e.target
														.value as unknown as string,
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
						</IonCol>
						<IonCol>
							<IonRow class=" ">
								{errors.url && (
									<IonText color="danger" className="text-sm">
										{errors.queryTerms?.message}
									</IonText>
								)}
							</IonRow>
						</IonCol>

						<IonCol>
							<IonRow>
								<IonText className="ion-padding">
									Pick a date for remainder
								</IonText>
								{/* Time Input */}
								<IonDatetimeButton datetime="datetime-picker" />

								{/* Modal contains the actual datetime picker */}
								<IonModal keepContentsMounted={true}>
									<IonDatetime
										id="datetime-picker"
										presentation="date-time"
										// minuteValues={[0, 15, 30, 45]}
										className="ion-margin-top"
										isDateEnabled={(date) =>
											new Date() <= new Date(date)
										}
										onIonChange={(e) =>
											setValue(
												"time",
												e.target
													.value as unknown as string,
											)
										}
									/>
								</IonModal>
								{errors.time && (
									<IonText color="danger" className="text-sm">
										{errors.time.message}
									</IonText>
								)}
							</IonRow>
						</IonCol>

						<IonCol>
							<IonRow>
								{/* Submit Button */}
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
