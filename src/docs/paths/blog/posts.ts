export const blogPostPaths = {
  '/blog/posts': {
    get: {
      summary: 'Lista todos os posts do blog',
      description:
        'Recupera uma lista de todos os posts do blog registrados no sistema.',
      tags: ['BlogPosts'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          required: false,
          schema: { type: 'integer', minimum: 1, default: 1 },
          description: 'Número da página para paginação',
        },
        {
          name: 'categorySlug',
          in: 'query',
          required: false,
          schema: { type: 'string' },
          description: 'Slug da categoria para filtrar os posts',
        },
      ],
      responses: {
        200: {
          description: 'Lista de posts recuperada com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  posts: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/BlogPost',
                    },
                  },
                },
                required: ['posts'],
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
  '/blog/posts/{id}/unpublish': {
    get: {
      summary: 'Despublica um post do blog',
      description:
        'Despublica um post específico do blog, tornando-o não visível para os leitores.',
      tags: ['BlogPosts'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID do post do blog',
        },
      ],
      responses: {
        200: {
          description: 'Post despublicado com sucesso',
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
};
