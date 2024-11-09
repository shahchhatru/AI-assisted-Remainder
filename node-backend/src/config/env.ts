import * as dotenv from "dotenv";

dotenv.config();

export default {
	port: process.env.PORT,
	cors: process.env.CORS || "*",
	endpoint: process.env.ENDPOINT || `http://localhost:${process.env.PORT || 5000}`,
	mongoDBURI: process.env.MONGO_DB_URI,
	DBName: process.env.DB_NAME || "BOILERPLATE-TEST",
	accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || "accessToken",
	refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "refreshToken",
	accessTokenValidity: process.env.ACCESS_TOKEN_VALIDITY || "1d",
	refreshTokenValidity: process.env.REFRESH_TOKEN_VALIDITY || "7d",
	email: process.env.EMAIL_USERNAME,
	password: process.env.EMAIL_PASSWORD,
};
