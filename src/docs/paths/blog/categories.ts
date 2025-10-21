export const categoryPaths = {
  '/blog/categories': {
    get: {
      summary: 'Lista todas as categorias',
      description:
        'Recupera uma lista de todas as categorias religiosas registradas no sistema.',
      tags: ['BlogCategories'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Lista de categorias recuperada com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  categories: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Category',
                    },
                  },
                },
                required: ['categories'],
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
      summary: 'Cria nova categoria',
      description:
        'Cria uma nova categoria de blog. O nome da categoria deve ser exclusivo.',
      tags: ['BlogCategories'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateCategoryRequest',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Category created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  category: {
                    $ref: '#/components/schemas/Category',
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
  '/blog/categories/{id}': {
    put: {
      summary: 'Atualiza categoria',
      description:
        'Atualiza as informações de uma categoria. Valida que o novo nome seja único (se alterado).',
      tags: ['BlogCategories'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID da category no formato ULID',
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
              $ref: '#/components/schemas/CreateCategoryRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Categoria atualizada com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  category: {
                    $ref: '#/components/schemas/Category',
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Nome já em uso ou erro de validação',
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
      summary: 'Deleta category',
      description:
        'Exclue uma categoria permanentemente. Não pode ser desfeito.',
      tags: ['BlogCategories'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID da categoria no formato ULID',
          schema: {
            type: 'string',
            pattern: '^[0-9A-HJKMNP-TV-Z]{26}$',
            example: '01K7WCX2R48A8NJYWAFQN3KCN8',
          },
        },
      ],
      responses: {
        204: {
          description: 'Categoria deletada com sucesso',
        },
        404: {
          description: 'Categoria não encontrada',
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
