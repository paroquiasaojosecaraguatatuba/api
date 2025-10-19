export const pastoralPaths = {
  '/pastorals': {
    get: {
      summary: 'Lista todas as pastorais',
      description:
        'Recupera uma lista de todas as pastorais religiosas registradas no sistema.',
      tags: ['Pastorals'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Lista de pastorais recuperada com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  pastorals: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Pastoral',
                    },
                  },
                },
                required: ['pastorals'],
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
      summary: 'Cria nova pastoral',
      description:
        'Cria uma nova pastoral religiosa. O nome da pastoral deve ser exclusivo e a imagem da capa deve existir como um anexo previamente carregado.',
      tags: ['Pastorals'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreatePastoralRequest',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Pastoral created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  pastoral: {
                    $ref: '#/components/schemas/Pastoral',
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
  '/pastorals/{id}': {
    put: {
      summary: 'Atualiza pastoral',
      description:
        'Atualiza as informações de uma pastoral. Valida que o novo nome seja único (se alterado) e que a imagem de capa exista.',
      tags: ['Pastorals'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID da pastoral no formato ULID',
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
              $ref: '#/components/schemas/CreatePastoralRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Pastoral atualizada com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  pastoral: {
                    $ref: '#/components/schemas/Pastoral',
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
      summary: 'Deleta pastoral',
      description:
        'Exclue uma pastoral permanentemente. Não pode ser desfeito.',
      tags: ['Pastorals'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID da pastoral no formato ULID',
          schema: {
            type: 'string',
            pattern: '^[0-9A-HJKMNP-TV-Z]{26}$',
            example: '01K7WCX2R48A8NJYWAFQN3KCN8',
          },
        },
      ],
      responses: {
        204: {
          description: 'Pastoral deletada com sucesso',
        },
        404: {
          description: 'Pastoral não encontrada',
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
