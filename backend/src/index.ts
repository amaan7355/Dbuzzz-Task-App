import express from "express";
import http from 'http';
import connectDatabase from "./database/database";
import cors from "cors";
import expressSession from "express-session";
import MongoStore from "connect-mongo";
import bodyParser from "body-parser";
import { DateTime } from "luxon";
import { User } from "./types/type";
import getisotime from "./utils/time";
import userRouter from "./routes/route"

connectDatabase();
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set('trust proxy', 1)
const PORT = 9000;
declare module 'express-session' {
    export interface SessionData { token: string; }
}
declare module 'express' {
    export interface Request { user?: User; }
}
app.use(cors({
    credentials: true,
    origin: '*'
    // origin: ['http://localhost:3001', 'http://localhost:3000', 'http://localhost:3003', 'http://localhost:9000',]
}));
const server = http.createServer(app);


const SECRET: any = process.env.DB_AUTH_SECRET;
// console.log(SECRET, "db secret");
app.use(expressSession({ secret: SECRET, resave: false, saveUninitialized: false, cookie: { secure: false, httpOnly: true, maxAge: 365 * 24 * 60 * 60 * 1000 }, store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL, collectionName: "user_data" }) }))

app.use("/api", userRouter);

// Define a route for the root URL
app.get("/api", (req: any, res: any) => {
    res.send("Response from Express server.");
});

server.listen(PORT, () => {
    console.log(`Server started at PORT ${PORT}`);
});
