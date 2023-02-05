import { IMessageBrokerRepository } from '@shankarregmi/common';
import { IUser } from '../interfaces/IUser';

export class UserService {
    constructor(private rabbitMQRepository: IMessageBrokerRepository) {}

    public async getUsers(userId: string): Promise<IUser[]> {
        const users: IUser[] = await this.rabbitMQRepository.callRPC({
            targetQueue: 'users',
            method: 'getUsers',
            params: {
               userId
            }
        });

        return users;
    }
}
