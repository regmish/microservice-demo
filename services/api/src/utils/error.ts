import httpStatus from 'http-status';

export interface IError {
  message: string;
  status?: number;
  stack?: Error['stack'];
}

export default class APIError extends Error {
  status: number;
  constructor(errorObj: IError) {
    super(errorObj.message);

    this.name = this.constructor.name;
    this.message = errorObj.message;
    this.status = errorObj.status || httpStatus.INTERNAL_SERVER_ERROR;
    this.stack = errorObj.stack;
  }
}
