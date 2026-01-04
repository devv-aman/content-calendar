import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./middlewares/logger.middleware.js";
import { MESSAGES } from "./constants/messages.js";

const startServer = (): void => {
  const app = createApp();

  app.listen(env.PORT, () => {
    logger.info(`${MESSAGES.SERVER.STARTED} ${env.PORT}`);
    logger.info(`Environment: ${env.NODE_ENV}`);
    logger.info(`Swagger docs: http://localhost:${env.PORT}/api-docs`);
  });
};

startServer();
