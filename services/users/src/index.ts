import { AMQPClient, logger } from '@shankarregmi/common';
import { getUsers } from './controllers/user.controller';

const amqpClient = new AMQPClient();

(async () => {
  await amqpClient.initialize({
    rpcQueue: {
      name: 'users',
      options: {
        durable: true,
      },
    },
  });

  logger.info({}, 'Users service started');
  await amqpClient.registerRPCHandlers({
    getUsers,
  });
})();
