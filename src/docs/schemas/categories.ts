export const categorySchemas = {
  Category: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: '01K7WCX2R48A8NJYWAFQN3KCN8',
        description: 'Identificador único no formato ULID',
      },
      name: {
        type: 'string',
        example: 'Artigos',
        description: 'Nome da category',
      },
      slug: {
        type: 'string',
        example: 'artigos',
        description: 'Slug da category',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-15T10:00:00Z',
        description: 'Data e hora de criação da category',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-20T15:30:00Z',
        description: 'Data e hora da última atualização da category',
      },
    },
    required: ['id', 'name', 'slug', 'createdAt', 'updatedAt'],
  },
  CreateCategoryRequest: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        example: 'Notícias',
        description: 'Nome da category',
      },
    },
    required: ['name'],
  },
};
