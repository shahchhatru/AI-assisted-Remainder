import express from "express";
import env from "./src/config/env";
import router from "./src/routes/";
import middleware from "./src/middleware";
import { errorHandler } from "./src/utils/ErrorHandler";
import { connectDB } from "./src/utils/ConnectDB";

// initialize server
const app = express();

// middlewares
app.use(middleware);

//routes
app.use(router);

//use global error handler
app.use(errorHandler);

const startServer = async () => {
	try {
		await connectDB();
		if (! env.port) throw new Error("PORT number not provided")
		app.listen(env.port, () => {
			const url = `http://localhost:${env.port}`;
			console.log(`Server running at \x1b[35m${url}\x1b[0m.`);
		});
	} catch (error) {
		console.log(`Failed to start server: \x1b[31m${error}\x1b[0m.`);
	}
};

startServer();
