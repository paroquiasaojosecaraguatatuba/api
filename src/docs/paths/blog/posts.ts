export const blogPostPaths = {
  '/blog/posts': {
    get: {
      summary: 'Lista todos os posts do blog',
      description:
        'Recupera uma lista de todos os posts do blog registrados no sistema.',
      tags: ['BlogPosts'],
      security: [{ bearerAuth: [] }],
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
};
