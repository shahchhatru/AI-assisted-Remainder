import mongoose, { Schema } from "mongoose";
import { ITasks } from "../../routes/v1/tasks/types";

const taskSchema = new Schema<ITasks>({
    uid: { type: String },
    url: { type: String, required: true },
    queryTerms: { type: String, required: true },
    hourInterval: { type: Number },
    daysInterval: { type: Number },
    time: { type: String },
    notificationType: { type: String, enum: ['Hourly', 'Day Interval'], required: true }
}, { timestamps: true });

const TaskModel = mongoose.model<ITasks>("Task", taskSchema);
export default TaskModel;
