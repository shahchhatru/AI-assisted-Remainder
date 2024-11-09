export interface ITasks {
    uid: string;
    url: string;
    queryTerms: string;
    hourInterval?: number;
    daysInterval?: number;
    time?: string;
    notificationType: "Hourly" | "Days interval";
}