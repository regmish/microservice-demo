/**
 * @interface IMessageBrokerRepository
 */

export interface IMessageBrokerRepository {
    initialize(): Promise<void>;
    registerRPCHandlers(payload: any): Promise<void>;
    executeRPC(payload: any): Promise<void>;
}