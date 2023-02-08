import { Options } from 'amqplib';
/**
 * @interface IMessageBrokerRepository
 */

export interface IMessageBrokerRepository {
  initialize(options?: IMessageBrokerInitializeOptions): Promise<void>;
  cleanup(): Promise<void>;
  registerRPCHandlers(rpcHandlers: IMessageBrokerRPCHandlers): Promise<void>;
  callRPC({
    targetQueue,
    method,
    params
  }: {
    targetQueue: string;
    method: string;
    params: any;
  }): Promise<any>;
}

export interface IMessageBrokerInitializeOptions {
  rpcQueue?: {
    name: string;
    options?: Options.AssertQueue;
  };
}

export interface IMessageBrokerRPCHandlers {
  [key: string]: (params: any) => Promise<any>;
}
