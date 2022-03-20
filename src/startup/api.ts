import express from 'express';
import bodyParser from 'body-parser';
import routes from '../routes';
import formatMiddleware from '../middlewares/format';

export default () => {
	const app = express();

	app.use(bodyParser.json());
	app.use(formatMiddleware);
	routes(app);

	const port = process.env.PORT ?? 9000
	app.listen(port, () => console.log("Listening on port " + port))
}