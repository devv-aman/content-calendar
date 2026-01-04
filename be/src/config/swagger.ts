import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env.js";
import { SWAGGER } from "../constants/index.js";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: SWAGGER.OPENAPI_VERSION,
    info: {
      title: SWAGGER.TITLE,
      version: SWAGGER.VERSION,
      description: SWAGGER.DESCRIPTION,
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: SWAGGER.DEV_SERVER_DESCRIPTION,
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "access_token",
          description: SWAGGER.COOKIE_AUTH_DESCRIPTION,
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            role: { type: "string", enum: ["user", "admin"] },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8 },
          },
        },
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: { type: "object" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
            error: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./src/modules/**/*.routes.ts", "./src/modules/**/*.controller.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
