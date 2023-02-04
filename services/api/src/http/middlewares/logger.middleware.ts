/* Node Modules */
import express from 'express';
import * as uuid from 'uuid';

/* Custom modules */
import logger from '../../logger';
import { SERVICE_PREFIX } from '../../constants';

interface IRequestMeta {
	originalUrl: string;
	path: string;
	method: string;
	startTime: number;
	route: string;
	params: unknown;
	query: unknown;
	organisationId?: string;
	userId?: string;
	userMail?: string;
}

declare module 'express' {
	export interface Response {
		requestmeta: IRequestMeta;
	}

	export interface Request {
		traceId: string;
		user: {
			id: string;
			_id: string;
			name: string;
			organisation: string;
			projects: string[];
		};
	}
}

export function createTraceId(prefix: string): string {
	const uid = uuid.v4();
	return `${prefix}-${uid}`;
}

/**
 * An express middleware that initializes traceId and disableSensitiveLogging.
 */
export function httpLogger(options?: object): express.RequestHandler {
	options = options || {};

	if (options.constructor.name === 'IncomingMessage') {
		throw new Error(
			'It appears you have done something like `app.use(httpLogger)`, but it should be `app.use(httpLogger())`.'
		);
	}

	return (
		request: express.Request,
		response: express.Response,
		next: express.NextFunction
	) => {
		request.traceId = createTraceId(SERVICE_PREFIX);

		response.requestmeta = {
			originalUrl: request.originalUrl,
			path: request.baseUrl + request.path,
			method: request.method,
			startTime: Date.now(),
			route: request.route,
			params: request.params,
			query: request.query
		};

		response.set('x-APP-Trace-Id', request.traceId);
		if (request.method !== 'OPTIONS') {
			logger.info(
				{ traceId: request.traceId, ...response.requestmeta },
				'Received new request'
			);
		}
		return next();
	};
}
