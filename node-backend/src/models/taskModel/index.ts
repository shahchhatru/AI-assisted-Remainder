import mongoose, { Schema } from "mongoose";
import cron from 'node-cron';
import axios from 'axios';
import { sendMailData } from "../../utils/mail";
import { ITasks } from "../../routes/v1/tasks/types";
import scrapesite from "../../utils/puppeeteer/scrapesite";

const taskSchema = new Schema<ITasks>({
    uid: { type: String },
    url: { type: String, required: true },
    queryTerms: { type: String, required: true },
    hourInterval: { type: Number },
    daysInterval: { type: Number },
    time: { type: String },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
    },

    
    notificationType: { type: String, enum: ['Hourly', 'Day Interval'], required: true },
    taskCompleted:{type:Boolean,default:false}
}, { timestamps: true });

    // Cron job that runs daily at midnight (0 0 * * *)
    cron.schedule('0 0 * * *', async () => {
        try {
        const tasks = await TaskModel.find();
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
    
        for (const task of tasks) {
            if (task.notificationType === 'Hourly' && task.hourInterval) {
            // Calculate if an hourly task needs to be executed
            if (currentHour % task.hourInterval === 0) {
                console.log(`Executing hourly task for URL: ${task.url}`);
                // Awaiting scraping call
                const htmldata = await scrapesite(task.url, task.queryTerms);
            }
            }
    
            if (task.notificationType === 'Day Interval' && task.daysInterval) {
            // Check if a weekly task needs to be executed based on daysInterval
            const lastRunDate = task.updatedAt ? new Date(task.updatedAt) : null;
            if (!lastRunDate || Math.floor((currentDate - lastRunDate) / (1000 * 60 * 60 * 24)) >= task.daysInterval) {
                console.log(`Executing daily/weekly task for URL: ${task.url}`);
                // Awaiting scraping call
                const htmldata = await scrapesite(task.url, task.queryTerms);
                
                //call an api
                const response =await axios.post('http://publicip/run_prompt', {
                    data: htmldata,
                    queryTerms: task.queryTerms,
                  });
                
                if (response){
                    //send mail if success
                    await sendMailData(task.email,response);

                }
                // Update the task's timestamp to track the last run
                task.updatedAt = currentDate;
                await task.save();
            }
            }
        }
    
        console.log('Cron job execution completed.');
        } catch (error) {
        console.error('Error executing cron job:', error);
        }
    });
  

const TaskModel = mongoose.model<ITasks>("Task", taskSchema);
export default TaskModel;
