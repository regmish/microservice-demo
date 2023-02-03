/* Node modules */
import { Router, RequestHandler } from "express";

export const fallbackRouter = Router();

fallbackRouter.all("*", (): RequestHandler => {
	throw new Error("The requested operation or resource does not exist.");
});
