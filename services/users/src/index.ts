import { AMQPCLient } from '@shankarregmi/common';

const amqpClient = new AMQPCLient();

(async () => {
  await amqpClient.initialize();

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
