/**
 * Definições de paths (endpoints) do Swagger/OpenAPI
 * Mantém a documentação separada da lógica das rotas
 */

export const swaggerPaths = {
  "/auth/login": {
    post: {
      summary: "Fazer login",
      tags: ["Auth"],
      description: "Autentica um usuário e retorna um token JWT",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/LoginRequest",
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Login realizado com sucesso",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthResponse",
              },
            },
          },
        },
        "400": {
          description: "Dados inválidos",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        "401": {
          description: "Email ou senha incorretos",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },
  "/user/register": {
    post: {
      summary: "Registrar novo usuário",
      tags: ["User"],
      description: "Registra um novo usuário com name, email e password",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/RegisterRequest",
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Usuário registrado com sucesso",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PublicUserResponse",
              },
            },
          },
        },
        "400": {
          description: "Dados inválidos ou email já registrado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },
  "/user": {
    get: {
      summary: "Listar todos os usuários",
      tags: ["User"],
      description: "Lista todos os usuários cadastrados (requer autenticação)",
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Lista de usuários retornada com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/PublicUserResponse",
                },
              },
            },
          },
        },
        "401": {
          description: "Não autenticado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },
  "/user/{id}": {
    get: {
      summary: "Buscar usuário por ID",
      tags: ["User"],
      description: "Retorna um usuário específico (requer autenticação)",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
          },
          description: "ID do usuário",
        },
      ],
      responses: {
        "200": {
          description: "Usuário encontrado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PublicUserResponse",
              },
            },
          },
        },
        "401": {
          description: "Não autenticado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        "404": {
          description: "Usuário não encontrado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
    put: {
      summary: "Atualizar usuário",
      tags: ["User"],
      description:
        "Atualiza dados de um usuário específico (requer autenticação)",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
          },
          description: "ID do usuário",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateUserRequest",
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Usuário atualizado com sucesso",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PublicUserResponse",
              },
            },
          },
        },
        "400": {
          description: "Dados inválidos",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        "401": {
          description: "Não autenticado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        "404": {
          description: "Usuário não encontrado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
    delete: {
      summary: "Deletar usuário",
      tags: ["User"],
      description: "Deleta um usuário específico (requer autenticação)",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
          },
          description: "ID do usuário",
        },
      ],
      responses: {
        "204": {
          description: "Usuário deletado com sucesso",
        },
        "401": {
          description: "Não autenticado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        "404": {
          description: "Usuário não encontrado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },
};
