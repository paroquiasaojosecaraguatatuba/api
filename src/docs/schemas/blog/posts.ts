export const blogPostsSchemas = {
  BlogPost: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: '01K7WCX2R48A8NJYWAFQN3KCN8',
        description: 'Identificador único no formato ULID',
      },
      title: {
        type: 'string',
        example: 'Contribua com a construção do nosso Centro Pastoral',
        description: 'Título do post do blog',
      },
      slug: {
        type: 'string',
        example: 'contribua-com-a-construcao-do-nosso-centro-pastoral',
        description: 'Slug do post do blog',
      },
      content: {
        type: 'string',
        example: '<p>Estamos construindo um novo centro pastoral...</p>',
        description: 'Conteúdo do post do blog em HTML',
      },
      excerpt: {
        type: 'string',
        example: 'Participe da construção do nosso novo centro pastoral...',
        description: 'Resumo ou trecho do post do blog',
      },
      coverId: {
        type: 'string',
        example: '01K7WCX2R48A8NJYWAFQN3KCN8',
        description: 'Identificador do anexo que serve como capa do post',
      },
      eventDate: {
        type: 'string',
        format: 'date-time',
        example: '2024-03-10T14:00:00Z',
        description: 'Data e hora do evento relacionado ao post, se aplicável',
      },
      publishedAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-02-25T09:00:00Z',
        description: 'Data e hora de publicação do post do blog',
      },
      scheduledUnpublishAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-03-25T18:00:00Z',
        description: 'Data e hora agendada para despublicação do post do blog',
      },
      categorySlug: {
        type: 'string',
        example: 'artigos',
        description: 'Slug da categoria associada ao post do blog',
      },
      authorId: {
        type: 'string',
        example: '01K7WCX2R48A8NJYWAFQN3KCN8',
        description: 'Identificador do autor do post do blog',
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
    required: [
      'id',
      'title',
      'slug',
      'content',
      'categorySlug',
      'authorId',
      'createdAt',
    ],
  },
};
