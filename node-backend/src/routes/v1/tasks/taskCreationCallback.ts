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

    /**
     * sample 
     * A task has been created with following details:  {
  uid: 'auth0|672f5297172b35246cf6bdcb',
  url: 'daraz.com.np',
  queryTerms: 'olaol',
  hourInterval: 1,
  daysInterval: 1,
  time: '2024-11-09T20:53:59.866Z',
  notificationType: 'Hourly',
  _id: new ObjectId('672fcde0e94794f62f09267e'),
  createdAt: 2024-11-09T21:02:24.335Z,
  updatedAt: 2024-11-09T21:02:24.335Z,
  __v: 0
}
     */
}

function webScrapingFunction() {
    // 
}