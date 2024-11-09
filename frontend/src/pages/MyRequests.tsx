import { useEffect, useState } from "react";
import { TasksApi } from "../API/TasksApi";
import { IForm } from "../components/DataInputForm";
import { toast } from "react-toastify";
import {
    IonButton,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonPage,
    IonRow,
    IonText,
    IonTitle,
    IonToolbar,
    IonAlert,
} from "@ionic/react";

export default function MyRequests() {
    const [tasks, setTasks] = useState<IForm[]>([]);
    const [activeTask, setActiveTask] = useState<IForm | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

    const TasksService = {
        get: async () => {
            try {
                const response = await TasksApi.get();
                setTasks(response.data.data);
                // toast.success("Tasks retrieved successfully");
            } catch (error) {
                toast.error("Couldn't fetch tasks");
            }
        },

        create: async (data: IForm) => {
            try {
                const response = await TasksApi.post(data);
                setTasks(tasks => [...tasks, response.data.data]);
                toast.success("Task created successfully");
            } catch (error) {
                toast.error("Couldn't create the task");
            }
        },

        update: async (data: IForm) => {
            try {
                const response = await TasksApi.put(activeTask?._id!, data);
                setTasks(tasks => tasks.map(task =>
                    task._id === response.data.data._id ? response.data.data : task
                ));
                toast.success("Task updated successfully");
            } catch (error) {
                toast.error("Couldn't update the task");
            }
        },

        partialUpdate: async (id: string, data: Partial<IForm>) => {
            try {
                const response = await TasksApi.patch(id, data);
                setTasks(tasks => tasks.map(task =>
                    task._id === response.data.data._id ? response.data.data : task
                ));
                toast.success("Task partially updated successfully");
            } catch (error) {
                toast.error("Couldn't partially update the task");
            }
        },

        delete: async (id: string) => {
            try {
                await TasksApi.delete(id);
                setTasks(tasks => tasks.filter(task => task._id !== id));
                toast.success("Task deleted successfully");
            } catch (error) {
                toast.error("Couldn't delete the task");
            }
        }
    };

    const handleDelete = (id: string) => {
        setTaskToDelete(id);
        setShowAlert(true);
    };

    const confirmDelete = async () => {
        if (taskToDelete) {
            await TasksService.delete(taskToDelete);
        }
        setShowAlert(false);
    };

    useEffect(() => {
        TasksService.get();
    }, []);

    return (
        <IonPage>
            <IonHeader >
                <IonToolbar
                    color="secondary"
                    className="ion-justify-content-between"
                >
                    <IonTitle className="ion-text-center" >
                        Your Requests
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">

                {tasks.length > 0 ? (
                    <IonGrid>
                        <IonRow>
                            <IonCol size="2" ><strong>URL</strong></IonCol>
                            <IonCol size="2" class="ion-text-center "><strong>Query Terms</strong></IonCol>
                            <IonCol size="2" class="ion-text-center"><strong>Notification Type</strong></IonCol>
                            <IonCol size="2" class="ion-text-center"><strong>Interval</strong></IonCol>
                            <IonCol size="2" class="ion-text-center"><strong>Notification Time</strong></IonCol>
                            <IonCol size="2" class="ion-text-center" ><strong>Action</strong></IonCol>
                        </IonRow>
                        {tasks.map((task) => (
                            <IonRow key={task._id}>
                                <IonCol size="2" >{task.url}</IonCol>
                                <IonCol size="2" class="ion-text-center">{task.queryTerms}</IonCol>
                                <IonCol size="2" class="ion-text-center">{task.notificationType}</IonCol>
                                <IonCol size="2" class="ion-text-center">
                                    {task.notificationType === "Hourly" ? task.hourInterval + " Hours"
                                        : task.daysInterval + " Days"}
                                </IonCol>
                                <IonCol size="2" class="ion-text-center" >{task.time?.substring(11, 16) || "N/A"}</IonCol>
                                <IonCol size="2" class="ion-text-center">
                                    <IonButton onClick={() => handleDelete(task._id!)} color="danger" size="small">Delete</IonButton>
                                    {/* <IonButton color="warning" size="small">Update</IonButton> */}
                                </IonCol>
                            </IonRow>
                        ))}
                    </IonGrid>
                ) : (
                    <IonText color="medium">No tasks found.</IonText>
                )}
            </IonContent>

            <IonAlert
                isOpen={showAlert}
                onDidDismiss={() => setShowAlert(false)}
                header="Confirm Delete"
                message="Are you sure you want to delete this task?"
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                    },
                    {
                        text: 'Delete',
                        handler: confirmDelete,
                    }
                ]}
            />
        </IonPage>
    );
}
