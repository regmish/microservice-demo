// /* Node modules*/
import type { Server } from "http";

// /* Custom Modules */
import ExpressServer from "./http/server";
import logger from "./logger";
import { PORT } from "./constants";

import { RabbitMQRepository } from "./repositories/rabbitMQ.repository";
// import { RedisCacheRepository } from "./repositories/redisCache.repository";

import { UserController } from "./controllers/user.controller";

export const startHttpServer = async (): Promise<Server> => {
	/** Start health-check endpoint */

	const rabbitMQRepository = new RabbitMQRepository();
	// const redisCacheRepository = new RedisCacheRepository();

	// await redisCacheRepository.initialize();
	await rabbitMQRepository.initialize();

	const userCtrl = new UserController();
	// 	new QuantitativeReportsService(redisCacheRepository, rabbitMQRepository),
	// 	new MessagesReportsService(redisCacheRepository, rabbitMQRepository),
	// 	new TranscriptsReportsService(redisCacheRepository, rabbitMQRepository),
	// 	new StepsReportsService(redisCacheRepository, rabbitMQRepository),
	// 	new GoalsReportsService(rabbitMQRepository)
	// );

	// const analyticsCtrl = new AnalyticsController(new AnalyticsService(rabbitMQRepository));
	// const conversationsCtrl = new ConversationsController(
	// 	new ConversationsService(redisCacheRepository, rabbitMQRepository)
	// );

	const expressApp = await new ExpressServer().initialize([
		// {
		// 	path: "/v1.0/insights",
		// 	router: insightsCtrl.v1Routes(),
		// 	middlewares: [jwtAuthentication]
		// },
		// {
		// 	path: "/v2.0/analytics",
		// 	router: analyticsCtrl.v2Routes(),
		// 	middlewares: [jwtAuthentication]
		// },
		{
			path: "/v1.0/users",
			router: userCtrl.routes(),
			middlewares: []
		}
	]);

	const serverInstance = expressApp.listen(PORT, () => {
		logger.info({}, `Server listening on port ${PORT}`, null);
	});

	return serverInstance;
};

async function disconnectAndKill(signal: string): Promise<void> {
	logger.info({}, `Received '${signal}' command...`, null);
	// eslint-disable-next-line no-process-exit
	process.exit(0);
}
process.on("SIGTERM", () => disconnectAndKill("SIGTERM"));
process.on("SIGINT", () => disconnectAndKill("SIGINT"));

process.on("uncaughtException", (err) => {
	logger.error({}, `Uncaught exception error caught. Error was: ${JSON.stringify(err)}`, null);
});

/** Bootstrap HTTP Server */
startHttpServer().catch((err) => {
	logger.error({}, `Error starting server. Error was: ${JSON.stringify(err)}`, null);
});
