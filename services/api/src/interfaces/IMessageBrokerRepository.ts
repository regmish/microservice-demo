/**
 * @interface IMessageBrokerRepository
 */

export interface IMessageBrokerRepository {
    initialize(): Promise<void>;
    publishMessage(message: any, routingKey: string): Promise<void>;
    registerConsumers(consumers: (() => any)[]): Promise<void>;
}