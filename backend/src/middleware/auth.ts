import { } from 'dotenv/config'
import jwt, { JwtPayload } from "jsonwebtoken"
import { Request, Response, NextFunction, RequestHandler } from "express";
import userModel from '../models/users/userModel';



const SECRET_KEY = process.env.DB_AUTH_SECRET;

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let newToken = ""
        if (req.session.token) {
            newToken = req.session.token
            console.log("auth");
        } else {
            if (req.headers.authorization) {
                let objs = req.headers.authorization.replace("Bearer", "");
                console.log("inside if________", objs);
                newToken = objs.trim()
            }

        }
        // console.log("uuuuuuuu", newToken, SECRET_KEY)
        if (newToken && SECRET_KEY) {
            let user: any = jwt.verify(newToken, SECRET_KEY);
            console.log("verify - " + user?.email);
            console.log("verify -> new token " + newToken + typeof(newToken));
            req.user = user;
            if (user) {
                let user_doc = await userModel.findOne({ email: user.email, token: newToken.trim() })
                console.log(user_doc, "user_doc");
                
                if (user_doc) {
                    next();
                } else {
                    res.status(400).json({ message: "Unauthorized access signin required" })
                }
            } else {
                res.status(400).json({ message: "Unauthorized access signin required" })
            }

        } else {
            res.status(400).json({ message: "Unauthorized access signin required" })
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "Unauthorized access signin required" })
    }
}

export default auth
