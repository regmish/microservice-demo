import httpStatus from "http-status";

export default class APIError extends Error {
	status: number;
	constructor({ message, status }) {
		super(message);

		this.name = this.constructor.name;
		this.message = message;
		this.status = status || httpStatus.INTERNAL_SERVER_ERROR;
	}
}
