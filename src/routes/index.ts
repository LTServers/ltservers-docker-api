import { Application } from "express";
import server from "./server";
import errorMiddleware from "./../middlewares/error";

export default (app: Application) => {
	app.use(errorMiddleware);
	app.use("/server", server);

	app.get("/status", (req, res) => res.send({ status: "up" }));

	console.log("Added routes");
};
