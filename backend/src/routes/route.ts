import express from "express";
import { changePassword, Signup } from "../controllers/session/signup";
import { getSingleUser, Signin, signout } from "../controllers/session/signin";
import auth from "../middleware/auth";
import { deleteTask, getAllTasks, getAllTasksUser, handleAddTask, updateTask } from "../controllers/tasks/task";

const router = express.Router();

//----------------------------------------------Session-----------------------------------------------------------------------------------------
router.post("/signup", Signup);
router.post("/signin", Signin);
router.get("/getsingleuser", auth, getSingleUser);
router.post("/signout", signout);
router.post("/change-password", auth, changePassword);


//----------------------------------------------Tasks---------------------------------------------------------------
router.post("/add-task", auth, handleAddTask);
router.get("/get-all-tasks", getAllTasks);
router.post("/get-all-tasks-user", auth, getAllTasksUser);
router.post("/delete-task", auth, deleteTask);
router.post("/update-task", auth, updateTask);





export default router;