import { Request, Response } from "express";
import getisotime from "../../utils/time";
import { DateTime } from "luxon";
import userModel from "../../models/users/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const Signin = async (req: Request, res: Response) => {
    let { email, password } = req.body;
    let date: any = getisotime(DateTime)
    let user = await userModel.findOne({ email });
    if (!user) {
        res.status(400).json({ message: "User not found" })
        return;
    }
    let isPasswordCorrect = await bcrypt.compare(password, user?.password);
    if (!isPasswordCorrect) {
        res.status(400).json({ message: "Invalid credentials" })
        return;
    }
    try {
        const secret = process.env.DB_AUTH_SECRET;
        // console.log(secret, "db secret");
        let token;
        if (secret) {
            token = jwt.sign({ email, user_id: user._id }, secret);
            console.log(token, "token")
            req.session.token = token
        }
        const userData = await userModel.findByIdAndUpdate(
            user?._id, {
            token,
            updated_at: date,
            updated_by: user?._id
        }, { new: true }
        )
        res.status(200).json({ message: "Signin Successfull", userData, token })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" + error })
    }
}

export const getSingleUser = async (req: Request, res: Response) => {
    try {
        let result: any = await userModel.findById(req?.user?.user_id)
        if (!result) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ message: "single user fetch successfully", result })
    } catch (error: any) {
        res.status(500).json({ message: "Something went wrong" + error.message });
        return

    }
}

export const signout = async (req: Request, res: Response) => {
    let {email, user_id} = req.body;
    let date = getisotime(DateTime)
    let secret = process.env.DB_AUTH_SECRET || "xtsecure" //change it
    console.log(req.headers.authorization + "*************");
    console.log(req.session?.token, "session token");

    try {
        // if (!req.session?.token) {
        //     res.status(400).json({ message: "Already signout" });
        //     return;
        // }

        // let tokenData: any = jwt.verify(req.session.token, secret)
        // let { email, user_id } = tokenData
        // console.log(email, user_id);
        let loggedinstatus = await userModel.findOneAndUpdate(
            { email }, {
            token: "",
            updated_at: date,
            updated_by: user_id
        }, { new: true }) // add updated by 

        let user: any = await userModel.findOne({ email })

        if (loggedinstatus) {
            req.session.destroy(() => { })
            res.status(200).json({ message: "SignOut Successfully ", userData: user })
        } else {
            res.status(400).json({ message: "Something went wrong !!" })
        }

    } catch (error: any) {
        res.status(500).json({ message: "Something went wrong " + error.message })

    }

}