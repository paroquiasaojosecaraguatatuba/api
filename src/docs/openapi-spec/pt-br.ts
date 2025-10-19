export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Paróquia São José API',
    description: 'API para gerenciamento de comunidades paroquiais',
    version: '1.0.0',
    contact: {
      name: 'Giselle Hoekveld Silva',
      email: 'gisellehoekveld.contato@gmail.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3333',
      description: 'Servidor de Desenvolvimento',
    },
    {
      url: 'https://api.paroquiasaojosecaraguatatuba.workers.dev',
      description: 'Servidor de Produção',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'HMAC_256',
        description:
          'Token de autenticação customizado usando HMAC-256. Formato: Bearer {token}',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '01K7WCX2R48A8NJYWAFQN3KCN8',
            description: 'Identificador único no formato ULID',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'janedoe@example.com',
            description: 'Endereço de email do usuário',
          },
          role: {
            type: 'string',
            example: 'admin',
            description: 'Função do usuário no sistema',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-10-18T21:26:36.811Z',
            description: 'Timestamp de criação do usuário',
          },
        },
        required: ['id', 'email', 'role', 'createdAt'],
      },
      Community: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '01K7WCX2R48A8NJYWAFQN3KCN8',
            description: 'Identificador único no formato ULID',
          },
          name: {
            type: 'string',
            example: 'Paróquia São José',
            description: 'Nome da comunidade',
          },
          type: {
            type: 'string',
            enum: ['chapel', 'parish_church'],
            example: 'parish_church',
            description: 'Tipo de comunidade religiosa',
          },
          address: {
            type: 'string',
            example: 'R. Edson dos Santos, 30 - Caraguatatuba - SP',
            description: 'Endereço completo da comunidade',
          },
          coverId: {
            type: 'string',
            example: '01K7WHHBXWKXWYWE9ZCY88MG2Z',
            description: 'ID do anexo da imagem de capa',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-10-18T21:26:36.811Z',
            description: 'Timestamp da última atualização',
          },
        },
        required: ['id', 'name', 'type', 'address', 'coverId'],
      },
      RegisterUserRequest: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'joaodasilva@example.com',
            description: 'Endereço de email do usuário',
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'SenhaSegura123!',
            description: 'Senha do usuário (mínimo 8 caracteres)',
          },
          role: {
            type: 'string',
            example: 'user',
            description:
              'Função do usuário no sistema (ex: user, admin, viewer)',
          },
        },
        required: ['name', 'email', 'password'],
      },
      CreateCommunityRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            example: 'Capela São Pedro',
            description: 'Nome da comunidade religiosa',
          },
          type: {
            type: 'string',
            enum: ['chapel', 'parish_church'],
            example: 'chapel',
          },
          address: {
            type: 'string',
            example: 'Rua das Flores, 123 - Centro',
          },
          coverId: {
            type: 'string',
            example: '01K7WHHBXWKXWYWE9ZCY88MG2Z',
            description: 'ID do anexo da imagem de capa',
          },
        },
        required: ['name', 'type', 'address', 'coverId'],
      },
      UnauthorizedResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Token inválido ou expirado.',
          },
        },
        required: ['message'],
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example:
              'Ocorreu um erro no servidor. Por favor, tente novamente mais tarde.',
          },
        },
        required: ['message'],
      },
      InvalidCredentialsResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Email ou senha inválidos.',
          },
        },
      },
      ResourceNotFoundResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Comunidade não encontrada.',
          },
        },
        required: ['message'],
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    '/sessions': {
      post: {
        summary: 'Autentica usuário e gera token JWT',
        description:
          'Autentica um usuário com email e senha, retornando um token JWT para acesso aos endpoints protegidos.',
        tags: ['Users'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'janedoe@example.com',
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    example: 'SenhaSegura123!',
                  },
                },
                required: ['email', 'password'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Autenticação bem-sucedida',
            headers: {
              'Set-Cookie': {
                description: 'Cookie HTTP-only contendo o refresh token',
                schema: {
                  type: 'string',
                  example:
                    'refreshToken=eyJhbGciOiJIUzI1NiIs...; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000',
                },
              },
            },
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: {
                      type: 'string',
                      example:
                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMUs3V0NYMlI0OEE4TkpZV0FGUU4zS0NOKCIsImlhdCI6MTY5NzE2MjYzNn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
                      description: 'Token JWT para autenticação',
                    },
                  },
                  required: ['token'],
                },
              },
            },
          },
          401: {
            description: 'Falha na autenticação',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/InvalidCredentialsResponse',
                },
              },
            },
          },
        },
      },
    },
    '/token/refresh': {
      post: {
        summary: 'Renova token JWT usando refresh token',
        description:
          'Gera um novo token JWT válido usando o refresh token armazenado no cookie HTTP-only.',
        tags: ['Users'],
        responses: {
          200: {
            description: 'Token renovado com sucesso',
            headers: {
              'Set-Cookie': {
                description: 'Novo cookie HTTP-only contendo o refresh token',
                schema: {
                  type: 'string',
                  example:
                    'refreshToken=eyJhbGciOiJIUzI1NiIs...; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000',
                },
              },
            },
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: {
                      type: 'string',
                      example:
                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMUs3V0NYMlI0OEE4TkpZV0FGUU4zS0NOKCIsImlhdCI6MTY5NzE2MjYzNn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
                      description: 'Novo token JWT para autenticação',
                    },
                  },
                  required: ['token'],
                },
              },
            },
          },
          401: {
            description: 'Refresh token ausente ou inválido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UnauthorizedResponse',
                },
              },
            },
          },
        },
      },
    },
    '/users': {
      post: {
        summary: 'Registra novo usuário',
        description:
          'Registra um novo usuário no sistema. Somente administradores podem criar usuários.',
        tags: ['Users'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RegisterUserRequest',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Usuário registrado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
          400: {
            description: 'Erro de validação ou email já em uso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/attachments/images/upload': {
      post: {
        summary: 'Carrega imagem como anexo',
        description:
          'Carrega uma imagem (JPEG ou PNG) para ser usada como anexo, retornando um ID único para referência futura.',
        tags: ['Attachments'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Arquivo de imagem JPEG ou PNG',
                  },
                },
                required: ['file'],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Imagem carregada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    attachmentId: {
                      type: 'string',
                      example: '01K7WHHBXWKXWYWE9ZCY88MG2Z',
                      description: 'ID único do anexo carregado',
                    },
                  },
                  required: ['attachmentId'],
                },
              },
            },
          },
          400: {
            description: 'Erro de validação ou formato de arquivo inválido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/communities': {
      get: {
        summary: 'Lista todas as comunidades',
        description:
          'Recupera uma lista de todas as comunidades religiosas registradas no sistema.',
        tags: ['Communities'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de comunidades recuperada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    communities: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Community',
                      },
                    },
                  },
                  required: ['communities'],
                },
              },
            },
          },
          401: {
            description: 'Autenticação necessária',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UnauthorizedResponse',
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Cria nova comunidade',
        description:
          'Cria uma nova comunidade religiosa (capela ou igreja paroquial). O nome da comunidade deve ser exclusivo e a imagem da capa deve existir como um anexo previamente carregado.',
        tags: ['Communities'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateCommunityRequest',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Community created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    community: {
                      $ref: '#/components/schemas/Community',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation error or business rule violation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          401: {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UnauthorizedResponse',
                },
              },
            },
          },
        },
      },
    },
    '/communities/{id}': {
      put: {
        summary: 'Atualiza comunidade',
        description:
          'Atualiza as informações de uma comunidade. Valida que o novo nome seja único (se alterado) e que a imagem de capa exista.',
        tags: ['Communities'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID da comunidade no formato ULID',
            schema: {
              type: 'string',
              pattern: '^[0-9A-HJKMNP-TV-Z]{26}$',
              example: '01K7WCX2R48A8NJYWAFQN3KCN8',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateCommunityRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Comunidade atualizada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    community: {
                      $ref: '#/components/schemas/Community',
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              'Nome já em uso, capa não encontrada ou erro de validação',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          404: {
            description: 'Recurso não encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ResourceNotFoundResponse',
                },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Deleta comunidade',
        description:
          'Exclue uma comunidade permanentemente. Não pode ser desfeito.',
        tags: ['Communities'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID da comunidade no formato ULID',
            schema: {
              type: 'string',
              pattern: '^[0-9A-HJKMNP-TV-Z]{26}$',
              example: '01K7WCX2R48A8NJYWAFQN3KCN8',
            },
          },
        ],
        responses: {
          204: {
            description: 'Cominidade deletada com sucesso',
          },
          404: {
            description: 'Comunidade não encontrada',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ResourceNotFoundResponse',
                },
              },
            },
          },
        },
      },
    },
  },
  tags: [
    {
      name: 'Users',
      description: 'Operações relacionadas com usuários do sistema',
    },
    {
      name: 'Attachments',
      description: 'Operações relacionadas com anexos de arquivos',
    },
    {
      name: 'Communities',
      description:
        'Operações relacionadas com comunidades religiosas (capelas e paróquias)',
    },
  ],
};

export default openApiSpec;
