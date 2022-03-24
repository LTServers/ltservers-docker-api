import { ExpressMiddleware } from ".";

const errorMiddleware: ExpressMiddleware = (req, res, next) => {
	try {
		next();
	} catch (e) {
		res.status(500).json({ message: "Server error: " + e.message });
	}
};

export default errorMiddleware;
