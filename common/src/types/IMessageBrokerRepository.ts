/**
 * @interface IMessageBrokerRepository
 */

export interface IMessageBrokerRepository {
    initialize(): Promise<void>;
    registerRPCHandlers({
        rpcQueue,
        rpcHandlers
    }: {
        rpcQueue: string;
        rpcHandlers: IAMQPRPCHandlers;
    }): Promise<void>;
    executeRPC({
        rpcQueue,
        payload
    }: {
        rpcQueue: string;
        payload: IAMQPRPCPayload;
    }): Promise<any>;
}

export interface IAMQPRPCPayload {
    type: string;
    data: any;
}

export interface IAMQPRPCHandlers {
	[key: string]: (payload: IAMQPRPCPayload) => Promise<any>;
}
