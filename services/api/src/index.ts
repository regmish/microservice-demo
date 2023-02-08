// /* Node modules*/
import type { Server } from 'http';
import { logger } from '@shankarregmi/common';

// /* Custom Modules */
import ExpressServer from './http/server';
import { PORT } from './constants';

import { RabbitMQRepository } from './repositories/rabbitMQ.repository';
import { RedisClientRepository } from './repositories/redisClient.repository';

import { UserController } from './controllers/user.controller';
import { UserService } from './controllers/user.service';

export const startHttpServer = async (): Promise<Server> => {
  const rabbitMQRepository = new RabbitMQRepository();
  const redisClientRepository = new RedisClientRepository();

  await rabbitMQRepository.initialize();
  await redisClientRepository.initialize();

  const userCtrl = new UserController(new UserService(rabbitMQRepository));

  const expressApp = await new ExpressServer().initialize([
    {
      path: '/v1.0/users',
      router: userCtrl.routes(),
      middlewares: [],
    },
  ]);

  const serverInstance = expressApp.listen(PORT, () => {
    logger.info({}, `Server listening on port ${PORT}`, null);
  });

  return serverInstance;
};

async function disconnectAndKill(signal: string): Promise<void> {
  logger.info({}, `Received '${signal}' command...`, null);
  process.exit(0);
}
process.on('SIGTERM', () => disconnectAndKill('SIGTERM'));
process.on('SIGINT', () => disconnectAndKill('SIGINT'));

process.on('uncaughtException', (err) => {
  logger.error(
    {},
    `Uncaught exception error caught. Error was: ${JSON.stringify(err)}`,
    null
  );
});

/** Bootstrap HTTP Server */
startHttpServer().catch((err) => {
  logger.error(
    {},
    `Error starting server. Error was: ${JSON.stringify(err)}`,
    null
  );
});
