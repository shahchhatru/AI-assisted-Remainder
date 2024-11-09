import mongoose, { Document, Model, Schema } from "mongoose";
import sendMail from "../../utils/mail";
import userServices from "../../routes/v1/users/user.services";
import CustomError from "../../utils/CustomError";
import { messages } from "../../utils/Messages";
import UserModel from "../userModel";

export interface IOTP {
    code: number,
    email: string,
    user_id: string,
}

export interface IOTPDocument extends Document, IOTP { }

export interface IOTPModel extends Model<IOTPDocument> {
    generateAndSendOTP(_id: string, email: string): Promise<boolean>;
    regenerateOTP(email: string): Promise<boolean>;
    verifyOTP(OTP: number): Promise<boolean>;
}

const OTPSchema = new Schema<IOTPDocument>({
    code: {
        type: Number,
        unique: true,
        required: true,
    },
    user_id: {
        type: String,
        ref: "User",
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    }
}, { timestamps: true, expireAfterSeconds: 600 }); // OTP valid for 10 minutes

OTPSchema.statics.generateAndSendOTP = async function (_id: string, email: string): Promise<boolean> {
    const OTP = Math.floor(100000 + Math.random() * 900000);

    const existingOTP = await this.findOne({ email });
    if (existingOTP) {
        await this.deleteOne({ email }); // multiple otp request before one expires.
    }

    const newOTP = new this({ code: OTP, user_id: _id, email });
    await newOTP.save();

    await sendMail(email, OTP);
    return true;
};


OTPSchema.statics.regenerateOTP = async function (email: string): Promise<boolean> {
    let user_id;
    const existingOTP = await this.findOne({ email });

    if (!existingOTP) {
        const user = await UserModel.findOne({ email });
        if (!user) throw new CustomError(404, messages.OTP.invalid_email);
        if (user && user.emailVerified) throw new CustomError(404, messages.OTP.invalid_email);
        user_id = user._id;

    } else {
        user_id = existingOTP.user_id;
    }

    try {
        await (this as IOTPModel).generateAndSendOTP(user_id, email);
        return true;
    } catch (error) {
        // Handle any errors related to OTP generation or sending
        console.error("Error generating or sending OTP:", error);
        return false;
    }
};


OTPSchema.statics.verifyOTP = async function (OTP: number): Promise<boolean> {
    const OTPDoc = await this.findOne({ code: OTP });
    if (!OTPDoc) {
        return false;
    }

    const { _id, email, code, user_id } = OTPDoc;
    const isOTPValid = code === OTP;

    if (isOTPValid) {
        await userServices.verifyUser(user_id, email);
        await this.deleteOne({ _id });
    }

    return isOTPValid;
};

const OTPModel = mongoose.model<IOTPDocument, IOTPModel>("OTP", OTPSchema);
export default OTPModel;
