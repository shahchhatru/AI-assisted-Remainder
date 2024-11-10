import axios from "axios";
import scrapesite from "../../../utils/puppeeteer/scrapesite";
import { ITasks } from "./types";
import cron from "node-cron";
import { sendMailData } from "../../../utils/mail";

export function taskCreationCallback(task: ITasks) {

    // Define cron schedule string based on task's notificationType and intervals
    let scheduleString = '';

    if (task.notificationType === 'Hourly' && task.hourInterval) {
        // Run at intervals within the hour (e.g., every hour or every 2 hours)
        scheduleString = `0 */${task.hourInterval} * * *`;  // e.g., '0 */2 * * *' runs every 2 hours
    }
    else if (task.notificationType === 'Days interval' && task.daysInterval) {
        // Run at intervals based on days (e.g., every day or every 3 days)
        scheduleString = `0 0 */${task.daysInterval} * *`;  // e.g., '0 0 */3 * *' runs every 3 days
    }
    else {
        console.error('Invalid notificationType or interval not provided');
        return;
    }

    // Schedule the cron job
    const job = cron.schedule(scheduleString, async () => {
        try {
            console.log(`Executing task with URL: ${task.url}`);
            const htmldata = await scrapesite(task.url, task.queryTerms);

            // Call an API and send mail if successful
            const response = await axios.post('http://20.197.34.102:8000/run_prompt', {
                data: htmldata,
                queryTerms: task.queryTerms,
            });

            if (response) {
                await sendMailData(task.email, response.data);
            }

        } catch (error) {
            console.error(`Error executing task for URL ${task.url}:`, error);
        }
    });

}

