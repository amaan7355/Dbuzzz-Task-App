import { DateTime } from "luxon";
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    task: {type: String},
    due_date: {type: String},
    status: {type: String},
    created_at: {type: String},
    updated_at: {type: String}
});

taskSchema.pre("save", function setDatetime(next) {
    this.created_at = DateTime.now().toUTC().toISO()
    this.updated_at = DateTime.now().toUTC().toISO()
    next()
})

const taskModel = mongoose.model("task", taskSchema);

export default taskModel;