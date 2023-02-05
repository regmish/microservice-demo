import { AMQPCLient, logger } from '@shankarregmi/common';

const amqpClient = new AMQPCLient();

(async () => {
  await amqpClient.initialize();

  logger.info({}, 'Users service started');
  await amqpClient.registerRPCHandlers({
    rpcQueue: 'users',
    rpcHandlers: {
      listUsers: async (data) => {
        console.log('Received RPC call for listUsers ', JSON.stringify(data));

        return {
          users: [
            {
              name: 'Shankar Regmi',
              age: 30,
            },
            {
              name: 'Hasan Khadar',
              age: 30,
            },
          ],
        };
      },
    },
  });
})();
