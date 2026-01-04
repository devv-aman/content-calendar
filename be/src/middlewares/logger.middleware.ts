import pino from "pino";
import pinoHttp from "pino-http";
import { IncomingMessage, ServerResponse } from "http";
import { env } from "../config/env.js";

export const logger = pino({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  transport:
    env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname,req,res,responseTime",
            messageFormat: "{msg}",
          },
        }
      : undefined,
});

export const requestLogger = pinoHttp.default({
  logger,
  autoLogging: true,
  customLogLevel: (
    _req: IncomingMessage,
    res: ServerResponse,
    err: Error | undefined
  ) => {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return "warn";
    } else if (res.statusCode >= 500 || err) {
      return "error";
    }
    return "info";
  },
  customSuccessMessage: (
    req: IncomingMessage,
    res: ServerResponse,
    responseTime: number
  ) => {
    return `${req.method} ${req.url} ${res.statusCode} - ${Math.round(
      responseTime
    )}ms`;
  },
  customErrorMessage: (
    req: IncomingMessage,
    res: ServerResponse,
    _err: Error
  ) => {
    const reqBody = (req as IncomingMessage & { body?: unknown }).body;
    return `${req.method} ${req.url} ${res.statusCode} - Req: ${JSON.stringify(
      reqBody || {}
    )}`;
  },
  // Don't log req/res objects separately
  serializers: {
    req: () => undefined,
    res: () => undefined,
  },
});
