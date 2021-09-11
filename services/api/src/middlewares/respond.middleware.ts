import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../types';

export const respond = (req: Request, res: IResponse<any>, next: NextFunction): Response | void => {
  if ('data' in res) {
    return res.status(httpStatus.OK).json(res.data);
  }
  return next();
};
