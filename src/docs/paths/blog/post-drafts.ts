export const blogPostDraftPaths = {
  '/blog/post-drafts': {
    post: {
      summary: 'Cria novo rascunho de post',
      description:
        'Cria um novo rascunho de post do blog. O título do rascunho deve ser exclusivo.',
      tags: ['BlogPostDrafts'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateBlogPostDraftRequest',
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
                    $ref: '#/components/schemas/BlogPostDraft',
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
  '/blog/post-drafts/{id}/publish': {
    put: {
      summary: 'Publica rascunho de post',
      description:
        'Valida que o novo título seja único (se alterado) e atualiza a versão publicada do post e deleta o rascunho após a publicação.',
      tags: ['BlogPostDrafts'],
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
  '/blog/post-drafts/{id}': {
    put: {
      summary: 'Atualiza rascunho de post',
      description: 'Atualiza as informações do rascunho',
      tags: ['BlogPostDrafts'],
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
              $ref: '#/components/schemas/CreateBlogPostDraftRequest',
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
                    $ref: '#/components/schemas/BlogPostDraft',
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
      summary: 'Deleta o rascunho',
      description: 'Exclue o rascunho permanentemente. Não pode ser desfeito.',
      tags: ['BlogPostDrafts'],
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
