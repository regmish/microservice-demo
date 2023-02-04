import { IMessageBrokerRepository } from '@shankarregmi/common';
import { IUser } from '../interfaces/IUser';

export class UserService {
    constructor(private rabbitMQRepository: IMessageBrokerRepository) {}

    public async getUsers(): Promise<IUser[]> {
        const users: IUser[] = await this.rabbitMQRepository.executeRPC({
            rpcQueue: 'users',
            payload: {
                type: 'listUsers',
                data: {
                    userId: '507f1f77bcf86cd799439011'
                }
            }
        });

        return users;
    }
}
