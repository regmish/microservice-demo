import { Request, Response, NextFunction } from 'express';
import Ajv from 'ajv';
import httpStatus from 'http-status';
import APIError from '../utils/error';
import { AJVSchema } from '../types';

const ajv = new Ajv({ allErrors: true });

export const validate = (schema: AJVSchema) => (req: Request, res: Response, next: NextFunction): void => {
  const validate = ajv.compile(schema);

  validate(req.body) ? next() : next(new APIError({ message: ajv.errorsText(validate.errors), status: httpStatus.BAD_REQUEST }));
};
