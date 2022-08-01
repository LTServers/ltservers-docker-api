import { Application } from "express";
import server from "./server";
import errorMiddleware from "./../middlewares/error";

export default (app: Application) => {
	app.use(errorMiddleware);
	app.use("/server", server);
	console.log("Added routes");
};
