import { useEffect, useState } from 'react';
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
    IonText,
    IonAvatar,
} from '@ionic/react';
import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from '../components/Logout';

export default function Profile() {
    const { user, isAuthenticated, isLoading, logout } = useAuth0();
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        if (isAuthenticated) {
            setUserData(user); // Set the user data once authenticated
        }
    }, [isAuthenticated, user]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>User Profile</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {isAuthenticated && userData ? (
                    <IonCard>
                        <IonCardHeader>
                            <IonAvatar>
                                <img src={userData.picture} alt="User Avatar" />
                            </IonAvatar>
                            <IonCardTitle>{userData.name}</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <IonText>
                                <p><strong>Email:</strong> {userData.email}</p>
                                <p><strong>Nickname:</strong> {userData.nickname}</p>
                                <p>{!user?.email_verified ? "You have not verified your email" : "Your email is verified"}</p>
                            </IonText>
                            <LogoutButton />
                        </IonCardContent>
                    </IonCard>
                ) : (
                    <IonText color="medium">You are not authenticated. Please log in.</IonText>
                )}
            </IonContent>
        </IonPage>
    );
}

