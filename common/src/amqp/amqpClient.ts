import amqp from "amqplib";
import fs from "fs";
import uuid from "uuid";
import { IMessageBrokerRepository } from "../interfaces/IMessageBrokerRepository";

export interface IRPCCalls {
	[key: string]: (message: any) => Promise<any>;
}

export default class AMQPCLient implements IMessageBrokerRepository {
	private _connection: amqp.Connection;
	private _channel: amqp.Channel;

	public async initialize(): Promise<void> {
		this._connection = await amqp.connect(await this._buildConnectionString());

		this._connection.on("error", this._handleConnectionError.bind(this));
		this._connection.on("close", this._handleConnectionClose.bind(this));
		this._channel = await this._connection.createChannel();
	}

	public async registerRPCHandlers({
		rpcQueue,
		rpcHandlers
	}: {
		rpcQueue: string;
		rpcHandlers: IRPCCalls;
	}): Promise<void> {
		if (!this._channel) throw new Error("AMQP channel not initialized");

		await this._channel.assertQueue(rpcQueue, {
			durable: true
		}); /** @todo make it configurable */

		await this._channel.prefetch(5);

		(async () => {
			await this._channel.consume(rpcQueue, (message: amqp.ConsumeMessage | null) =>
				this._genericConsumeFunction(rpcHandlers, message)
			);
		})().catch((err) => {
			console.error(`Error consuming Message from Queue ${rpcQueue}`, err);
		});
	}

	public async executeRPC({
		rpcQueue,
		payload
	}: {
		rpcQueue: string;
		payload: any;
	}): Promise<any> {
		if (!this._channel) throw new Error("AMQP channel not initialized");
		return this._executeRPCInternal({
			rpcQueue,
            payload
		});
	}

	/** Helper Methods */

	/** Build connection string either from secret file mounted or env variables */
	private async _buildConnectionString(): Promise<string> {
		if (process.env.AMQP_CONNECTION_STRING) {
			return process.env.AMQP_CONNECTION_STRING;
		} else if (process.env.AMQP_SECRET_PATH) {
			try {
				const secretFile = await fs.promises.readFile(process.env.AMQP_SECRET_PATH, "utf8");

				return secretFile.trim();
			} catch (error) {
				console.error(`Error reading AMQP secret file: ${error}`);
				throw error;
			}
		} else if (
			process.env.AMQP_USERNAME &&
			process.env.AMQP_PASSWORD &&
			process.env.AMQP_HOST &&
			process.env.AMQP_PORT
		) {
			return `amqp://${process.env.AMQP_USERNAME}:${process.env.AMQP_PASSWORD}@${process.env.AMQP_HOST}:${process.env.AMQP_PORT}`;
		} else {
			throw new Error(
				"Insufficient AMQP credentials provided. Please check the environment variables."
			);
		}
	}

	/**
	 * @todo: Implement Reconnect logic
	 */
	private _handleConnectionError(error: Error): void {
		console.error(`AMQP connection error: ${error}`);
	}

	private _handleConnectionClose(): void {
		console.error(`AMQP connection closed`);
	}

	private async _genericConsumeFunction(
		rpcCalls: IRPCCalls,
		message: amqp.ConsumeMessage | null
	): Promise<void> {
		if (!message) return;

		const { content, properties } = message;

		const { correlationId, replyTo } = properties;

		const { type, data } = JSON.parse(content.toString());

		if (!rpcCalls[type]) {
			console.error(`RPC Call ${type} not registered`);
			return;
		}

		try {
			const result = await rpcCalls[type](data);

			this._channel.sendToQueue(replyTo, Buffer.from(JSON.stringify(result)), {
				correlationId
			});

			this._channel.ack(message);
		} catch (error) {
			console.error(`Error executing RPC Call ${type}`, error);

			this._channel.sendToQueue(replyTo, Buffer.from(JSON.stringify(error)), {
				correlationId
			});

			this._channel.ack(message);
		}
	}

	private async _executeRPCInternal({ rpcQueue, payload }) {
        const { queue: replyToQueue } = await this._channel.assertQueue("", { exclusive: true });
        const correlationId = uuid.v4();

		return new Promise(async (resolve, reject) => {
			await this._channel.consume(
				replyToQueue,
				(message: amqp.ConsumeMessage | null) => {
					if (!message) return;

					const { content, properties } = message;

					const { correlationId: responseCorrelationId } = properties;

					if (correlationId === responseCorrelationId) {
						const { error, result } = JSON.parse(content.toString());

						if (error) {
							reject(error);
						} else {
							resolve(result);
						}
					}

					this._channel.ack(message);
				},
				{ noAck: false }
			);

			this._channel.sendToQueue(rpcQueue, Buffer.from(JSON.stringify(payload)), {
				correlationId,
				replyTo: replyToQueue
			});
		});
	}
}
