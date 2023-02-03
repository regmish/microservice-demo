/* Node modules */
import express, { NextFunction, Request, Response, Router } from "express";
import http from "http";
import cors from "cors";
import helmet, { HelmetOptions } from "helmet";
import HttpStatusCode from "http-status";
/**
 * This takes care of async error handling in any of the express middlewares,
 * that are uncaught. Starting express.js v5.0 this is no more needed
 */
require("express-async-errors");

/* Custom modules */
import { fallbackRouter, httpLogger } from "./middlewares";
import { VERSION } from "../constants";
import logger from "../logger";

export interface IHttpServerInitilzeParams {
	path: string;
	router: Router;
	middlewares: express.RequestHandler[];
}

export default class HttpServer {
	async initialize(routes: IHttpServerInitilzeParams[]): Promise<express.Application> {
		const app = express();

		/** Strict-Transport-Security options for Helmet */
		const helmetOptions: HelmetOptions = {
			hsts: {
				maxAge: 31536000,
				includeSubDomains: true,
				preload: true
			}
		};
		/**
		 * Disable not needed features
		 */
		app.set("etag", false).set("x-powered-by", false);

		app.use(httpLogger());

		app.use(helmet(helmetOptions));

		app.use(cors());
		app.use(express.urlencoded({ extended: false }));
		app.use(
			express.json({
				limit: process.env.HTTP_JSON_BODY_LIMIT
					? `${process.env.HTTP_JSON_BODY_LIMIT}kb`
					: "100kb"
			})
		);

		app.options("*", cors());

		app.get("/favicon.ico", (request, response) => {
			response.status(HttpStatusCode.NOT_FOUND).send();
		});

		app.get("/", (_, res) => {
			res
				.json({
					name: "API",
					version: VERSION
				})
				.send();
		});

		/** Mount our routers */
		routes.forEach(({ path, router, middlewares }) => {
			app.use(path, ...middlewares, router);
		});

		/** Register fallback router */
		app.use(fallbackRouter);

		app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
			response
				.json({
					error: err.message
				})
				.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
				.send();
			logger.error(err);
		});

		http.createServer(app);

		return app;
	}
}
