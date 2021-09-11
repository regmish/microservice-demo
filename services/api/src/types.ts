import { Request, Response, Express } from 'express';
import { JSONSchema7 } from 'json-schema';

export interface IApp extends Express {
  module?: Function;
}

export interface IRequest extends Request {
  authenticated: boolean;
}

export interface IResponse<T> extends Response {
  data: T;
}

export interface AJVSchema extends JSONSchema7 {
  title: string;
}
