import mongoose from "mongoose";
import env from "../config/env";

export async function connectDB() {
	try {
		if (!env.mongoDBURI) {
			throw new Error("MongoDB connection URI not found");
		}
		await mongoose.connect(`${env.mongoDBURI}/${env.DBName}`);
		console.log(`\x1b[32m[connectDB] MongoDB connected successfully!!\x1b[0m`);
	} catch (error) {
		console.log(`[connectDB] MongoDB connection failed: \x1b[31m[${error}]\x1b[0m`);
	}
}
