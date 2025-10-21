export const blogDraftsSchemas = {
  BlogDraft: {
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
        description: 'Título do rascunho do blog',
      },
      slug: {
        type: 'string',
        example: 'contribua-com-a-construcao-do-nosso-centro-pastoral',
        description: 'Slug do rascunho do blog',
      },
      content: {
        type: 'string',
        example: '<p>Estamos construindo um novo centro pastoral...</p>',
        description: 'Conteúdo do rascunho do blog em HTML',
      },
      excerpt: {
        type: 'string',
        example: 'Participe da construção do nosso novo centro pastoral...',
        description: 'Resumo ou trecho do rascunho do blog',
      },
      coverId: {
        type: 'string',
        example: '01K7WCX2R48A8NJYWAFQN3KCN8',
        description: 'Identificador do anexo que serve como capa do rascunho',
      },
      eventDate: {
        type: 'string',
        format: 'date-time',
        example: '2024-03-10T14:00:00Z',
        description:
          'Data e hora do evento relacionado ao rascunho, se aplicável',
      },
      scheduledPublishAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-02-25T09:00:00Z',
        description: 'Data e hora agendada para publicação do rascunho do blog',
      },
      scheduledUnpublishAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-03-25T18:00:00Z',
        description:
          'Data e hora agendada para despublicação do rascunho do blog',
      },

      categorySlug: {
        type: 'string',
        example: 'artigos',
        description: 'Slug da categoria associada ao rascunho do blog',
      },
      authorId: {
        type: 'string',
        example: '01K7WCX2R48A8NJYWAFQN3KCN8',
        description: 'Identificador do autor do rascunho do blog',
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
  CreateBlogDraftRequest: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        example: 'Contribua com a construção do nosso Centro Pastoral',
        description: 'Título do rascunho do blog',
      },
      slug: {
        type: 'string',
        example: 'contribua-com-a-construcao-do-nosso-centro-pastoral',
        description: 'Slug do rascunho do blog',
      },
      content: {
        type: 'string',
        example: '<p>Estamos construindo um novo centro pastoral...</p>',
        description: 'Conteúdo do rascunho do blog em HTML',
      },
      excerpt: {
        type: 'string',
        example: 'Participe da construção do nosso novo centro pastoral...',
        description: 'Resumo ou trecho do rascunho do blog',
      },
      coverId: {
        type: 'string',
        example: '01K7WCX2R48A8NJYWAFQN3KCN8',
        description: 'Identificador do anexo que serve como capa do rascunho',
      },
      eventDate: {
        type: 'string',
        format: 'date-time',
        example: '2024-03-10T14:00:00Z',
        description:
          'Data e hora do evento relacionado ao rascunho, se aplicável',
      },
      scheduledPublishAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-02-25T09:00:00Z',
        description: 'Data e hora agendada para publicação do rascunho do blog',
      },
      scheduledUnpublishAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-03-25T18:00:00Z',
        description:
          'Data e hora agendada para despublicação do rascunho do blog',
      },
      categorySlug: {
        type: 'string',
        example: 'artigos',
        description: 'Slug da categoria associada ao rascunho do blog',
      },
    },
    required: ['name'],
  },
};
