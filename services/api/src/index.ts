// /* Node modules*/
import type { Server } from "http";

// /* Custom Modules */
import logger from "./logger";
import { PORT } from "./constants";
import ExpressServer from "./http/server";
// import { jwtAuthentication } from "./http/middlewares";

// import { RabbitMQRepository } from "./repositories/rabbitMQ.repository";
// import { RedisCacheRepository } from "./repositories/redisCache.repository";

// import { InsightsController } from "./controllers/insights.controller";
// import { AnalyticsController } from "./controllers/analytics.controller";
// import { ConversationsController } from "./controllers/conversations.controller";

// import { MessagesReportsService } from "./services/insights/messages/messagesReports.service";
// import { QuantitativeReportsService } from "./services/insights/quantitative/quantitativeReports.service";
// import { StepsReportsService } from "./services/insights/steps/stepsReports.service";
// import { GoalsReportsService } from "./services/insights/goals/goalsReports.service";
// import { TranscriptsReportsService } from "./services/insights/transcripts/transcriptsReports.service";
// import { AnalyticsService } from "./services/analytics/analytics.service";
// import { ConversationsService } from "./services/conversations/conversations.service";

export const startHttpServer = async (): Promise<Server> => {
	/** Start health-check endpoint */

	// const rabbitMQRepository = new RabbitMQRepository();
	// const redisCacheRepository = new RedisCacheRepository();

	// await redisCacheRepository.initialize();
	// await rabbitMQRepository.initialize();

	// const insightsCtrl = new InsightsController(
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
		// {
		// 	path: "/v2.0/conversations",
		// 	router: conversationsCtrl.v2Routes(),
		// 	middlewares: [jwtAuthentication]
		// }
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
