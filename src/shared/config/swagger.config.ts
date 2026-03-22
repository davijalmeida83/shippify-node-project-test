import swaggerJsdoc from "swagger-jsdoc";
import { swaggerPaths } from "../docs/swagger-paths";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Shippify API",
      version: "1.0.0",
      description: "API de autenticação e gerenciamento de usuários",
      contact: {
        name: "Shippify",
        email: "support@shippify.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/shippify-api/v1",
        description: "Servidor de desenvolvimento",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "usuario@example.com",
            },
            password: {
              type: "string",
              example: "senha123",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            token: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            user: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                },
                name: {
                  type: "string",
                },
                email: {
                  type: "string",
                },
              },
            },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: {
              type: "string",
              example: "João Silva",
            },
            email: {
              type: "string",
              format: "email",
              example: "joao.silva@example.com",
            },
            password: {
              type: "string",
              example: "123321",
            },
          },
        },
        PublicUserResponse: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            name: {
              type: "string",
            },
            email: {
              type: "string",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        UpdateUserRequest: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Novo Nome",
            },
            email: {
              type: "string",
              format: "email",
              example: "novo@example.com",
            },
            password: {
              type: "string",
              example: "novaSenha123",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            statusCode: {
              type: "number",
              example: 400,
            },
            message: {
              type: "string",
            },
            error: {
              type: "string",
            },
          },
        },
      },
    },
    paths: swaggerPaths,
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
