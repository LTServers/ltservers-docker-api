import express from "express";
import bodyParser from "body-parser";
import routes from "../routes";
import errorMiddleware from "./../middlewares/error";

export default () => {
	const app = express();

	app.use(bodyParser.json());
	app.use(errorMiddleware);
	routes(app);

	const port = process.env.PORT ?? 9000;
	app.listen(port, () => console.log("Listening on port " + port));
};
