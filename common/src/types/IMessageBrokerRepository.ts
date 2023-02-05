import { Options } from 'amqplib';
/**
 * @interface IMessageBrokerRepository
 */

export interface IMessageBrokerRepository {
  initialize(options?: IMessageBrokerInitializeOptions): Promise<void>;
  registerRPCHandlers({
    rpcHandlers,
  }: {
    rpcHandlers: IMessageBrokerRPCHandlers;
  }): Promise<void>;
  executeRPC({
    rpcQueue,
    payload,
  }: {
    rpcQueue: string;
    payload: IMessageBrokerRPCPayload;
  }): Promise<any>;
}

export interface IMessageBrokerInitializeOptions {
  rpcQueue?: {
    name: string;
    options?: Options.AssertQueue;
  };
}
export interface IMessageBrokerRPCPayload {
  type: string;
  data: any;
}

export interface IMessageBrokerRPCHandlers {
  [key: string]: (payload: IMessageBrokerRPCPayload) => Promise<any>;
}
