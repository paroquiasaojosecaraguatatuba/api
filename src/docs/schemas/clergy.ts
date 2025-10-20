export const clergySchemas = {
  Clergy: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: '01K7WCX2R48A8NJYWAFQN3KCN8',
        description: 'Identificador único no formato ULID',
      },
      name: {
        type: 'string',
        example: 'João da Silva',
        description: 'Nome completo do clérigo',
      },
      position: {
        type: 'string',
        enum: [
          'supreme_pontiff',
          'diocesan_bishop',
          'parish_priest',
          'permanent_deacon',
        ],
        example: 'diocesan_bishop',
        description: 'Posição do clérigo na hierarquia eclesiástica',
      },
      title: {
        type: 'string',
        example: 'Dom',
        description: 'Título honorífico do clérigo',
      },
      photoId: {
        type: 'string',
        example: '01K7WHHBXWKXWYWE9ZCY88MG2Z',
        description: 'ID do anexo da imagem de foto',
      },
    },
    required: ['id', 'name', 'position', 'title', 'photoId'],
  },
  CreateClergyRequest: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        example: 'João da Silva',
        description: 'Nome completo do clérigo',
      },
      position: {
        type: 'string',
        enum: [
          'supreme_pontiff',
          'diocesan_bishop',
          'parish_priest',
          'permanent_deacon',
        ],
        example: 'diocesan_bishop',
        description: 'Posição do clérigo na hierarquia eclesiástica',
      },
      title: {
        type: 'string',
        example: 'Dom',
        description: 'Título honorífico do clérigo',
      },
      photoId: {
        type: 'string',
        example: '01K7WHHBXWKXWYWE9ZCY88MG2Z',
        description: 'ID do anexo da imagem de foto',
      },
    },
    required: ['name', 'position', 'title', 'photoId'],
  },
};
