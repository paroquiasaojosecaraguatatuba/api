export const communityPaths = {
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
};
