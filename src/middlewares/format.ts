import { ExpressMiddleware } from ".";

const formatMiddleware: ExpressMiddleware = (req, res, next) => {
	const send = res.send;
	res.send = (body) => {
		const newBody = JSON.stringify(body);
		return send(newBody);
	}
}
export default formatMiddleware;