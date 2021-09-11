import { Request, Response, NextFunction} from 'express';
import httpStatus from 'http-status';
import APIError, { IError } from '../utils/error';

export const handler = (err: IError, req: Request, res: Response, next: NextFunction) => {
  const error = {
    status: err.status,
    message: err.message || httpStatus[err.status],
    stack: err.stack,
  };

  if (process.env.NODE_ENV === 'production') {
    delete error.stack;
  }

  res.status(err.status).json({ error });
};


export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const err: IError = new APIError({
    message: 'Not found',
    status: httpStatus.NOT_FOUND,
  });

  return handler(err, req, res, next);
};


export const convert = (err: IError, req: Request, res: Response, next: NextFunction): void => {
  let convertedError = err;

  if (!(err instanceof APIError)) {
    convertedError = new APIError({
      message: err.message,
      stack: err.stack,
    });
  }

  return handler(convertedError, req, res, next);
};
