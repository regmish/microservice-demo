import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { logger } from '@shankarregmi/common';
import APIError from '../apiError';

const convert = (err: APIError, req: Request, res: Response, next: NextFunction) => {
	let convertedError = err;

	if (!(err instanceof APIError)) {
		convertedError = new APIError({
			message: err['message'],
			status: err['status']
		});
	}

	return handler(convertedError, req, res, next);
};

const fallback = (req: Request, res: Response, next: NextFunction) => {
	const err = new APIError({
		message: 'The requested operation or resource does not exist.',
		status: httpStatus.NOT_FOUND
	});

	return handler(err, req, res, next);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handler = (err: APIError, req: Request, res: Response, _next: NextFunction) => {
	const error = {
		traceId: req.traceId,
		status: err.status,
		message: err.message || httpStatus[err.status],
		stack: err.stack
	};

	if (process.env.NODE_ENV !== 'development') {
		delete error.stack;
	}

	res.status(err.status).json({ error });
	logger.error(err);
};

export const error = {
	convert,
	fallback,
	handler
};
