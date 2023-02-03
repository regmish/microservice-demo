/* Node modules */
import { Router, RequestHandler } from "express";

export const fallbackRouter = Router();

fallbackRouter.all("*", (req, res): RequestHandler => {
	throw new Error("The requested operation or resource does not exist.");
});
