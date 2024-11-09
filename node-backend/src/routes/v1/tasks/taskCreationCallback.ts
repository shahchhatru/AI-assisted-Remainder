import { ITasks } from "./types";

export function taskCreationCallback(taskDetails: ITasks) {
    // After successful creation of task , this function is triggered with task details data type
    // export interface ITasks {
    //     uid: string;
    //     url: string;
    //     queryTerms: string;
    //     hourInterval?: number;
    //     daysInterval?: number;
    //     time?: string;
    //     notificationType: "Hourly" | "Days interval";
    // }

    /**
     * 1. now the cron job should be set here 
     * 2. nodemailer is already installed and working ( for otp) now to
     * configure node mailer ( add email and app password of your email on .env)
     * 
     */
    console.log(`A task has been created with following details: `, taskDetails)
}

function webScrapingFunction () {
    // 
}