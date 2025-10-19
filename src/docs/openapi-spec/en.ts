export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Paróquia São José API',
    description: 'API for managing parish communities, clergy and attachments',
    version: '1.0.0',
    contact: {
      name: 'Giselle Hoekveld Silva',
      email: 'your-email@example.com',
    },
  },
  servers: [
    {
      url: 'https://your-worker.workers.dev',
      description: 'Production server',
    },
    {
      url: 'http://localhost:8787',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Community: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '01K7WCX2R48A8NJYWAFQN3KCN8',
            description: 'Unique identifier using ULID format',
          },
          name: {
            type: 'string',
            example: 'Paróquia São José',
            description: 'Community name',
          },
          type: {
            type: 'string',
            enum: ['chapel', 'parish_church'],
            example: 'parish_church',
            description: 'Type of religious community',
          },
          address: {
            type: 'string',
            example: 'R. Edson dos Santos, 30 - Caraguatatuba - SP',
            description: 'Full address of the community',
          },
          coverId: {
            type: 'string',
            example: '01K7WHHBXWKXWYWE9ZCY88MG2Z',
            description: 'ID of the cover image attachment',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-10-18T21:26:36.811Z',
            description: 'Last update timestamp',
          },
        },
        required: ['id', 'name', 'type', 'address', 'coverId'],
      },
      CreateCommunityRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            example: 'Capela São Pedro',
            description: 'Community name (must be unique)',
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
            description: 'ID of an uploaded image attachment',
          },
        },
        required: ['name', 'type', 'address', 'coverId'],
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Community name already exists',
          },
          code: {
            type: 'string',
            example: 'RESOURCE_ALREADY_EXISTS',
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
    '/communities': {
      post: {
        summary: 'Create new community',
        description:
          'Creates a new religious community (chapel or parish church). The community name must be unique and the cover image must exist.',
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
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/communities/{id}': {
      put: {
        summary: 'Edit community',
        description:
          'Updates community information. Validates that the new name is unique (if changed) and that the cover image exists.',
        tags: ['Communities'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Community ID in ULID format',
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
            description: 'Community updated successfully',
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
              'Name already exists, cover image not found, or validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          404: {
            description: 'Community not found',
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
      delete: {
        summary: 'Delete community',
        description:
          'Permanently deletes a community. This action cannot be undone.',
        tags: ['Communities'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Community ID in ULID format',
            schema: {
              type: 'string',
              pattern: '^[0-9A-HJKMNP-TV-Z]{26}$',
              example: '01K7WCX2R48A8NJYWAFQN3KCN8',
            },
          },
        ],
        responses: {
          204: {
            description: 'Community deleted successfully',
          },
          404: {
            description: 'Community not found',
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
  },
  tags: [
    {
      name: 'Communities',
      description:
        'Operations related to religious communities (chapels and parishes)',
    },
    {
      name: 'Clergy',
      description:
        'Operations related to clergy members (priests, bishops, deacons)',
    },
    {
      name: 'Attachments',
      description: 'File upload and management operations',
    },
  ],
};

export default openApiSpec;
