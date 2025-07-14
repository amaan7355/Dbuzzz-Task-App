import mongoose, { Document } from "mongoose";

interface DocumentResult<T> {
    _doc: T;
}

export interface User extends DocumentResult<User>, Document {
    user_id: mongoose.Schema.Types.ObjectId,
    name: string,
    email: string,
    password: string,
    email_verified: boolean,
    email_verified_at: string,
    verification_code: string,
    otp_timestamp: string,
    status: number,
    reset_password_code: string,
    token: string,
    OS: string,
    time_zone: string,
    isLoggedIn: boolean,
    user_type_id: number,
    created_at: string,
    updated_at: string,
    updated_by: string,
}

export interface ArchivedUser extends DocumentResult<ArchivedUser>, Document {
    user_id: mongoose.Schema.Types.ObjectId,
    name: string,
    email: string,
    password: string,
    token: string,
    created_at: string,
    updated_at: string,
    updated_by: string,
}

