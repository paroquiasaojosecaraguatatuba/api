export const blogDraftPaths = {
  '/blog/drafts': {
    get: {
      summary: 'Lista todos os rascunhos do blog',
      description:
        'Recupera uma lista de todos os rascunhos do blog registrados no sistema.',
      tags: ['BlogDrafts'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Lista de rascunhos recuperada com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  drafts: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/BlogDraft',
                    },
                  },
                },
                required: ['drafts'],
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
      summary: 'Cria novo rascunho',
      description:
        'Cria um novo rascunho de blog. O título do rascunho deve ser exclusivo.',
      tags: ['BlogDrafts'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateDraftRequest',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Draft created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  draft: {
                    $ref: '#/components/schemas/BlogDraft',
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
  '/blog/drafts/{slug}': {
    get: {
      summary: 'Obtém rascunho por slug',
      description:
        'Recupera um rascunho de blog específico usando seu slug único.',
      tags: ['BlogDrafts'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'slug',
          in: 'path',
          required: true,
          description: 'Slug do rascunho do blog',
          schema: {
            type: 'string',
            example: 'contribua-com-a-construcao-do-nosso-centro-pastoral',
          },
        },
      ],
      responses: {
        200: {
          description: 'Rascunho recuperado com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  draft: {
                    $ref: '#/components/schemas/BlogDraft',
                  },
                },
                required: ['draft'],
              },
            },
          },
        },
        404: {
          description: 'Rascunho não encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ResourceNotFoundResponse',
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
  },
  '/blog/drafts/{id}/publish': {
    put: {
      summary: 'Publica rascunho',
      description:
        'Publica um rascunho de blog, transformando-o em uma postagem publicada.',
      tags: ['BlogDrafts'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID do rascunho no formato ULID',
          schema: {
            type: 'string',
            pattern: '^[0-9A-HJKMNP-TV-Z]{26}$',
            example: '01K7WCX2R48A8NJYWAFQN3KCN8',
          },
        },
      ],
      responses: {
        204: {
          description: 'Rascunho publicado com sucesso',
        },
        400: {
          description: 'Rascunho não encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
        403: {
          description: 'Não autorizado a publicar o rascunho',
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
  '/blog/drafts/{id}': {
    put: {
      summary: 'Atualiza rascunho',
      description:
        'Atualiza as informações do rascunho. Valida que o novo título seja único (se alterado).',
      tags: ['BlogDrafts'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID da draft no formato ULID',
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
              $ref: '#/components/schemas/CreateDraftRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Rascunho atualizada com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  draft: {
                    $ref: '#/components/schemas/BlogDraft',
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Título já em uso ou erro de validação',
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
      summary: 'Deleta draft',
      description: 'Exclue um rascunho permanentemente. Não pode ser desfeito.',
      tags: ['BlogDrafts'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID da rascunho no formato ULID',
          schema: {
            type: 'string',
            pattern: '^[0-9A-HJKMNP-TV-Z]{26}$',
            example: '01K7WCX2R48A8NJYWAFQN3KCN8',
          },
        },
      ],
      responses: {
        204: {
          description: 'Rascunho deletado com sucesso',
        },
        404: {
          description: 'Rascunho não encontrado',
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
