import { Request, Response } from "express";
import userModel from "../../models/users/userModel";
import bcrypt from "bcrypt";
import getisotime from "../../utils/time";
import { DateTime } from "luxon";



export const Signup = async (req: Request, res: Response) => {
    let { name, email, password } = req.body;

    const isExist = await userModel.findOne({ email })
    if (isExist) {
        res.status(400).json({ message: "User already exist with this email" })
        return;
    }
    try {
        let codee
        codee = Math.abs(Math.random() * 100000)
        //    let code = String(Math.trunc(codee))
        let code = codee.toFixed(0)

        if (code.length < 5) {
            let i = 2
            while (code.length < 5) {
                code = code + "" + i
                i++
            }
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        // console.log(hashedPassword, "hashed password");

        const result = await userModel.create({
            name,
            email,
            password: hashedPassword,
        })
        res.status(200).json({ message: "Signup Successfull" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const changePassword = async (req: Request, res: Response) => {
    let { currentPassword, newPassword, user_id } = req.body;
    let date = getisotime(DateTime)
    try {
        if (!currentPassword) {
            res.status(400).json({ message: "Current password is required" })
            return;
        }
        if (!newPassword) {
            res.status(400).json({ message: "New password is required" })
            return;
        }
        let user: any = await userModel.findById(user_id);
        if (!user) {
            res.status(400).json({ message: "User doesn't exist" })
            return;
        }
        let isOldPasswordCorrect = await bcrypt.compare(currentPassword, user.password)
        if (!isOldPasswordCorrect) {
            res.status(400).json({ message: "Current password is incorrect" })
            return;
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        const result = await userModel.findByIdAndUpdate(
            user_id, {
            password: hashedPassword,
            updated_at: date,
            updated_by: user_id
        }, { new: true })
        res.status(200).json({ message: "Password changed successfully", result })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong " + error })
    }
};