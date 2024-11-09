import UserModel, { IUserDocument } from "../../../models/userModel";
import { IUser } from "./types";

const userRepository = {
    getAllUsers(): Promise<IUserDocument[] | null> {
        return UserModel.find().select({ "password": false });
    },

    findUserByEmail(email: string): Promise<IUserDocument | null> {
        return UserModel.findOne({ email }).select({ "password": false });
    },

    findUserById(_id: string): Promise<IUserDocument | null> {
        return UserModel.findById({ _id }).select({ "password": false });
    },

    findUserByUsername(username: string): Promise<IUserDocument | null> {
        return UserModel.findOne({ username }).select({ "password": false });
    },

    findUserByUsernameOrEmail(username: string, email: string): Promise<IUserDocument | null> {
        return UserModel.findOne({ $or: [{ username }, { email }] }).select({ "password": false });
    },

    findUserByData(userData?: Partial<IUser>): Promise<IUserDocument | null> {
        return UserModel.findOne(userData).select({ "password": false });
    },

    createNewUser(userData: IUser): Promise<IUserDocument> {
        const newUser = new UserModel(userData);
        return newUser.save()
    },

    updateUserData(_id: string, newData?: IUser): Promise<IUserDocument | null> {
        return UserModel.findOneAndUpdate({ _id }, { ...newData }, { new: true }).select({ "password": false });
    },

    deleteUser(_id: string): Promise<IUserDocument | null> {
        return UserModel.findOneAndUpdate({ _id }, { deleted: true, deactivated: true }, { new: true }).select({ "password": false });
    },

    recoverUser(_id: string): Promise<IUserDocument | null> {
        return UserModel.findOneAndUpdate({ _id }, { deleted: false }, { new: true }).select({ "password": false });
    },

    deactivateUser(_id: string): Promise<IUserDocument | null> {
        return UserModel.findOneAndUpdate({ _id }, { deactivated: true }, { new: true }).select({ "password": false });
    },

    reactivateUser(_id: string): Promise<IUserDocument | null> {
        return UserModel.findOneAndUpdate({ _id }, { deactivated: false }, { new: true }).select({ "password": false });
    },

    verifyUser(_id: string, email: string): Promise<IUserDocument | null> {
        return UserModel.findOneAndUpdate({_id, email}, { emailVerified: true}, {new: true}).select({ "password": false });
    }
}

export default userRepository;