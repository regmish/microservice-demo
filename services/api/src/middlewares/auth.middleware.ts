import { Response, NextFunction } from 'express';
import APIError from '../utils/error';
import { IApp, IRequest } from '../types';
import httpStatus from 'http-status';

export const requireAuth = (req: IRequest, res: Response, next: NextFunction) => {
  if (!req.authenticated) {
    return next(new APIError({
      status: httpStatus.UNAUTHORIZED,
      message: 'Unauthorized Access',
    }));
  }
  return next();
};

export const authenticate = (app: IApp) => async (
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // This is just for test purpose and can be disabled with a simple BYPASS_AUTH flag
  if (process.env.BYPASS_AUTH) {
    req.authenticated = true;
    return next();
  }

  const apiKey = req.headers['x-api-key'];

  if(apiKey && apiKey === process.env.API_KEY) {
    req.authenticated = true;
  }

  next();
};
