import express from 'express';
import bodyParser from 'body-parser';
import routes from '../routes';

export default () => {
	const app = express();

	app.use(bodyParser.json());
	routes(app);

	const port = process.env.PORT ?? 9000
	app.listen(port, () => console.log("Listening on port " + port))
}