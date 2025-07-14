import { DateTime } from "luxon";
import mongoose from "mongoose";
import { User } from "../../types/type";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    token: { type: String },
    created_at: { type: String },
    updated_at: { type: String },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

userSchema.pre("save", function setDatetime(next) {
    this.created_at = DateTime.now().toUTC().toISO()
    this.updated_at = DateTime.now().toUTC().toISO()
    next()
})


const userModel = mongoose.model<User>("user", userSchema);
export default userModel
