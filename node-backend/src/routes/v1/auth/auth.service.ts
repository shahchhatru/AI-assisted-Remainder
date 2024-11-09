import CustomError from "../../../utils/CustomError";
import { messages } from "../../../utils/Messages";
import { checkToken, signJWT } from "../../../utils/jwt";
import { IUser } from "../users/types";
import userRepository from "../users/user.repository";


const authService = {
    async login(username: string, email: string) {
        const user = await userRepository.findUserByUsernameOrEmail(username, email);
        if (user) {
            const { _id, username, email, role } = user
            const accessToken = signJWT({ _id, username, email, role }, "accessToken")
            const refreshToken = signJWT({ _id, username, email }, "refreshToken")
            return { accessToken, refreshToken }
        }
        throw new CustomError(404, messages.auth.invalid_account)
    },

    async refreshAccessToken(refreshToken: string) {
        const userData = checkToken(refreshToken, "refreshToken") as IUser;
        if (!userData) throw new CustomError(400, messages.token.invalid_token)

        const { _id, username, email } = userData
        const user = await userRepository.findUserByData({ _id, username, email })
        if (!user) throw new CustomError(400, messages.auth.invalid_account);

        const accessToken = signJWT({ _id: user?._id, username: user?.username, email: user?.email, role: user?.role }, "accessToken")
        return { accessToken }
    },

};

export default authService;