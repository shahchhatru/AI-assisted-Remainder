import mongoose from "mongoose";
import { IUser, UserRoles } from "../../routes/v1/users/types";
import bcrypt from "bcryptjs"


export interface IUserDocument extends IUser {
    comparePassword(candidatePassword: string): Promise<boolean>;
}


function emailValidator(email: string): boolean {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
}


const userSchema = new mongoose.Schema<IUserDocument>({
    firstName: {
        type: String,
        required: [true, "FirstName is required."],
    },

    middleName: String,

    lastName: {
        type: String,
        required: [true, "LastName is required."],
    },

    password: {
        type: String,
        required: [true, "Password is required."],
        minlength: [6, "Password must have at least 6 characters."]
    },

    username: {
        type: String,
        required: [true, "Username is required"],
        minLength: [5, "Username must have at least 5 characters."],
        maxLength: [15, "Username cannot have more than 15 characters."],
        unique: true
    },

    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
        validate: {
            validator: emailValidator, message: `The email format is invalid.`
        }
    },

    profilePicture: {type: String},

    emailVerified: {
        type: Boolean,
        default: false
    },

    role: {
        type: String,
        enum: Object.values(UserRoles),
        default: UserRoles.USER
    }, 

    deleted: {
        type: Boolean,
        default: false
    },

    deactivated: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (error) {
        if (error instanceof Error)
            return next(error);
    }
});


userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};



const UserModel = mongoose.model<IUserDocument>("User", userSchema);
export default UserModel;