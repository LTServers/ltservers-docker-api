import { Request, Response } from "express";

export type ExpressMiddleware = (
	req: Request,
	res: Response,
	next: () => void
) => void;
