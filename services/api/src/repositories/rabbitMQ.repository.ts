import { IMessageBrokerRepository } from "msdemo-common";
import logger from "../logger";

export class RabbitMQRepository implements IMessageBrokerRepository {
    async initialize(): Promise<void> {
        logger.info({}, "Initializing RabbitMQRepository", null);
    }

    async publishMessage(message: any, routingKey: string): Promise<void> {
        logger.info({}, `Publishing Message: ${message}, with routingKey: ${routingKey}`, null);
    }

    async registerConsumers(consumers: (() => any)[]): Promise<void> {
        for (const fn of consumers) {
            console.log(fn.name);
        }
    }
}