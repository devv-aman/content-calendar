import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";

import { env } from "./config/env.js";
import { swaggerSpec } from "./config/swagger.js";
import { ROUTES } from "./constants/routes.js";
import {
  requestLogger,
  errorHandler,
  notFoundHandler,
} from "./middlewares/index.js";
import { authRoutes } from "./modules/auth/index.js";
import { sendSuccess } from "./utils/response.js";

export const createApp = (): Application => {
  const app = express();

  // Security middlewares
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  // CORS configuration
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Cookie parsing
  app.use(cookieParser());

  // Request logging
  app.use(requestLogger);

  // Health check endpoint
  app.get(ROUTES.HEALTH, (_req, res) => {
    sendSuccess(res, 200, "OK", { status: "healthy" });
  });

  // Swagger documentation
  app.use(ROUTES.DOCS.SWAGGER, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get(ROUTES.DOCS.SWAGGER_JSON, (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  // API routes
  const apiPrefix = `${ROUTES.API_PREFIX}${ROUTES.API_VERSION}`;
  app.use(`${apiPrefix}${ROUTES.AUTH.BASE}`, authRoutes);

  // 404 handler
  app.use(notFoundHandler);

  // Error handler
  app.use(errorHandler);

  return app;
};
