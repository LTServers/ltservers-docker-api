import { ExpressMiddleware } from ".";

const errorMiddleware: ExpressMiddleware = (req, res, next) => {
	try {
		next();
	} catch (e) {
		// @ts-expect-error Error handling
		res.status(500).json({ message: "Server error: " + (e.message ?? e.json) });
	}
};

export default errorMiddleware;
