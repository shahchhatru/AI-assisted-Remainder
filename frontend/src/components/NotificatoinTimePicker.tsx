import React, { useState } from "react";
import {
  IonCol,
  IonRow,
  IonText,
  IonDatetimeButton,
  IonModal,
  IonDatetime,
} from "@ionic/react";

const NotificationTimePicker: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState<string>("");

  return (
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
              setSelectedTime(e.target.value as unknown as string)
            }
          />
        </IonModal>
      </IonRow>
    </IonCol>
  );
};

export default NotificationTimePicker;
