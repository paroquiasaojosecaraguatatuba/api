export const clergyPaths = {
  '/clergy': {
    get: {
      summary: 'Lista todos os clérigos',
      description:
        'Recupera uma lista de todas os clérigos registrados no sistema.',
      tags: ['Clergy'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Lista de clérigos recuperada com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  clergy: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Clergy',
                    },
                  },
                },
                required: ['clergy'],
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
      summary: 'Cria novo clérigo',
      description:
        'Cria um novo clérigo. O nome do clérigo deve ser exclusivo e a imagem da foto deve existir como um anexo previamente carregado.',
      tags: ['Clergy'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateClergyRequest',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Clergy created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  clergy: {
                    $ref: '#/components/schemas/Clergy',
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
  '/clergy/{id}': {
    put: {
      summary: 'Atualiza clérigo',
      description:
        'Atualiza as informações do clérigo especificado pelo ID. O nome do clérigo deve ser exclusivo e a imagem da foto deve existir como um anexo previamente carregado.',
      tags: ['Clergy'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID do clérigo no formato ULID',
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
              $ref: '#/components/schemas/CreateClergyRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Clérigo atualizado com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  clergy: {
                    $ref: '#/components/schemas/Clergy',
                  },
                },
              },
            },
          },
        },
        400: {
          description:
            'Nome já em uso, foto não encontrada ou erro de validação',
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
      summary: 'Deleta clérigo',
      description: 'Exclue um clérigo permanentemente. Não pode ser desfeito.',
      tags: ['Clergy'],
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
          description: 'Clérigo deletado com sucesso',
        },
        404: {
          description: 'Clérigo não encontrado',
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
};
