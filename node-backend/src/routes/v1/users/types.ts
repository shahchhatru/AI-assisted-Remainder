import mongoose from "mongoose";

export interface IUser {
    _id: mongoose.Types.ObjectId,
    firstName: string, 
    middleName?: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
    profilePicture?: string,
    emailVerified: boolean,
    role?: string,
    deleted?: boolean,
    deactivated?: boolean,
}

export enum UserRoles {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    USER = "USER",
}