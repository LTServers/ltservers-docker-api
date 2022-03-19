import { ExpressMiddleware } from ".";

const authMiddleware: ExpressMiddleware = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) return res.status(401).send({ message: "No authorization header !"});

	const token = authHeader.split(" ");
	if (token[0] !== "Bearer") return res.status(400).send({ message: "Authorization method different from Bearer !"});
	if (token[1] !== process.env.API_KEY) return res.status(401).send({ message: "Wrong API Key" });

	next();
}
export default authMiddleware;