import { Request, Response } from "express";
import taskModel from "../../models/tasks/taskModel";
import { DateTime } from "luxon";


export const handleAddTask = async (req: Request, res: Response) => {
    let { task, user_id, status } = req.body;
    if (!task.trim()) {
        res.status(400).json({ message: "Please provide a task" });
        return;
    }
    if (!user_id) {
        res.status(400).json({ message: "Please provide user_id" });
        return;
    }
    if (!status) {
        res.status(400).json({ message: "Please provide status" });
        return;
    }
    try {
        const result = await taskModel.create({
            user_id,
            task,
            status,
        })
        res.status(200).json({ message: "Task created", result })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

export const getAllTasks = async (req: Request, res: Response) => {
    try {
        const result = await taskModel.find({}).sort({ created_at: -1 }).populate(["user_id"]);
        res.status(200).json({ message: "Tasks fetched", result })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

export const getAllTasksUser = async (req: Request, res: Response) => {
    let { user_id } = req.body;
    if (!user_id) {
        res.status(400).json({ message: "Please provide user id" })
        return;
    }
    try {
        const result = await taskModel.find({ user_id }).sort({ created_at: -1 }).populate(["user_id"]);
        res.status(200).json({ message: "Tasks fetched for user", result });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

export const deleteTask = async (req: Request, res: Response) => {
    let { task_id } = req.body;
    if (!task_id) {
        res.status(400).json({ message: "Please provide task id" });
        return;
    }
    try {
        const result = await taskModel.findByIdAndDelete(task_id);
        res.status(200).json({ message: "Task deleted", result })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

export const updateTask = async (req: Request, res: Response) => {
    let { task_id, task, status } = req.body;
    if (!task_id || !task || !status) {
        res.status(400).json({ message: "Please provide all details" });
        return;
    }
    try {
        const result = await taskModel.findByIdAndUpdate(
            task_id, {
            task,
            status,
            updated_at: DateTime.now().toUTC().toISO()
        }, { new: true })
        res.status(200).json({ message: "Task Updated", result });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
}