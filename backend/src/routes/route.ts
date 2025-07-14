import express from "express";
import { changePassword, Signup } from "../controllers/session/signup";
import { getSingleUser, Signin, signout } from "../controllers/session/signin";
import auth from "../middleware/auth";

const router = express.Router();

//----------------------------------------------Session-----------------------------------------------------------------------------------------
router.post("/signup", Signup);
router.post("/signin", Signin);
router.get("/getsingleuser", auth, getSingleUser);
router.get("/signout", signout);
router.post("/change-password", auth, changePassword);





export default router;