import amqp from 'amqplib';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../logger/logger';

/** Types */
import {
  IMessageBrokerInitializeOptions,
  IMessageBrokerRPCHandlers,
  IMessageBrokerRepository,
} from '../types/IMessageBrokerRepository';

export class AMQPClient implements IMessageBrokerRepository {
  private _connection!: amqp.Connection;
  private _channel!: amqp.Channel;
  private _rpcQueue!: string;
  private _replyToQueue!: string;

  private _handlerMappings = new Map<
    string,
    {
      resolve: (data: unknown) => void;
      reject: (reason?: any) => void;
    }
  >();

  public async initialize(
    options?: IMessageBrokerInitializeOptions
  ): Promise<void> {
    if (this._connection && this._channel)
      throw new Error('AMQP connection already initialized');

    this._connection = await amqp.connect(await this._buildConnectionString());

    this._connection.on('error', this._handleConnectionError.bind(this));
    this._connection.on('close', this._handleConnectionClose.bind(this));
    this._channel = await this._connection.createChannel();

    if (options?.rpcQueue) {
      const { name: rpcQueue, options: rpcQueueOptions } = options.rpcQueue;
      await this._channel.assertQueue(rpcQueue, rpcQueueOptions);
      this._rpcQueue = rpcQueue;
      logger.info(`Waiting for RPC requests on queue ${rpcQueue}`);
    }
  }

  public async registerRPCHandlers({
    rpcHandlers,
  }: {
    rpcHandlers: IMessageBrokerRPCHandlers;
  }): Promise<void> {
    if (!this._channel) throw new Error('AMQP channel not initialized');

    if (!this._rpcQueue)
      throw new Error(
        'RPC Queue not initialized. Please initialize AMQP with rpcQueue option'
      );

    await this._channel.prefetch(5);

    (async () => {
      await this._channel.consume(
        this._rpcQueue,
        async (message: amqp.ConsumeMessage | null) => {
          if (!message) return;

          const { content, properties } = message;

          const { correlationId, replyTo } = properties;

          const { method, params } = JSON.parse(content.toString());

          if (!rpcHandlers[method]) {
            console.error(`RPC Call ${method} not registered`);
            this._channel.sendToQueue(
              replyTo,
              Buffer.from(
                JSON.stringify({
                  error: 'RPC Call not registered',
                })
              ),
              {
                correlationId,
              }
            );
            return;
          }

          try {
            const result = await rpcHandlers[method](params);

            this._channel.sendToQueue(
              replyTo,
              Buffer.from(JSON.stringify(result)),
              {
                correlationId,
              }
            );

            this._channel.ack(message);
          } catch (err) {
            const serializedError = {
              error: 'Unknown Error',
            };
            if (err instanceof Error) {
              serializedError.error = err.message;
            }

            this._channel.sendToQueue(
              replyTo,
              Buffer.from(JSON.stringify(serializedError)),
              {
                correlationId,
              }
            );

            this._channel.ack(message);
          }
        }
      );
    })().catch((err) => {
      console.error(
        `Error consuming Message from Queue ${this._rpcQueue}`,
        err
      );
    });
  }

  public async callRPC({
    targetQueue,
    method,
    params,
  }: {
    targetQueue: string;
    method: string;
    params: any;
  }): Promise<unknown> {
    if (!this._channel) throw new Error('AMQP channel not initialized');

    if (!this._replyToQueue) {
      await this._registerCallbackQueue();
    }

    return new Promise((resolve, reject) => {
      const correlationId = uuidv4();

      this._handlerMappings.set(correlationId, { resolve, reject });

      this._channel.sendToQueue(
        targetQueue,
        Buffer.from(JSON.stringify({ method, params })),
        {
          correlationId,
          replyTo: this._replyToQueue,
        }
      );
    });
  }

  /** Build connection string either from secret file mounted or env variables */
  private async _buildConnectionString(): Promise<string> {
    if (process.env.AMQP_CONNECTION_STRING) {
      return process.env.AMQP_CONNECTION_STRING;
    } else if (process.env.AMQP_SECRET_PATH) {
      try {
        const secretFile = await fs.promises.readFile(
          process.env.AMQP_SECRET_PATH,
          'utf8'
        );

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
        'Insufficient AMQP credentials provided. Please check the environment variables.'
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
    console.error('AMQP connection closed');
  }

  private async _registerCallbackQueue(): Promise<void> {
    const replyQueueName = `rpc-reply-${uuidv4()}`;

    this._replyToQueue = (
      await this._channel.assertQueue(replyQueueName, {
        autoDelete: true,
        durable: false,
        messageTtl: 10000,
      })
    ).queue;

    (async () => {
      await this._channel.consume(
        this._replyToQueue,
        async (message: amqp.ConsumeMessage | null) => {
          if (message?.properties?.correlationId) {
            const correlationId = message.properties.correlationId;

            const rpcHandler = this._handlerMappings.get(correlationId);

            const rpcResponse = JSON.parse(message.content.toString());

            if (rpcResponse?.error) {
              rpcHandler?.reject(rpcResponse.error);
            } else {
              rpcHandler?.resolve(rpcResponse);
            }
          }
        },
        { noAck: true }
      );
    })().catch((err) => {
      console.error(
        `Error consuming Message from Queue ${this._replyToQueue}`,
        err
      );
    });
  }
}
