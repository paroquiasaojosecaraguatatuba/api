export const communitySchemas = {
  Community: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: '01K7WCX2R48A8NJYWAFQN3KCN8',
        description: 'Identificador único no formato ULID',
      },
      name: {
        type: 'string',
        example: 'Paróquia São José',
        description: 'Nome da comunidade',
      },
      type: {
        type: 'string',
        enum: ['chapel', 'parish_church'],
        example: 'parish_church',
        description: 'Tipo de comunidade religiosa',
      },
      address: {
        type: 'string',
        example: 'R. Edson dos Santos, 30 - Caraguatatuba - SP',
        description: 'Endereço completo da comunidade',
      },
      coverId: {
        type: 'string',
        example: '01K7WHHBXWKXWYWE9ZCY88MG2Z',
        description: 'ID do anexo da imagem de capa',
      },
    },
    required: ['id', 'name', 'type', 'address', 'coverId'],
  },
  CreateCommunityRequest: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        example: 'Capela São Pedro',
        description: 'Nome da comunidade religiosa',
      },
      type: {
        type: 'string',
        enum: ['chapel', 'parish_church'],
        example: 'chapel',
      },
      address: {
        type: 'string',
        example: 'Rua das Flores, 123 - Centro',
      },
      coverId: {
        type: 'string',
        example: '01K7WHHBXWKXWYWE9ZCY88MG2Z',
        description: 'ID do anexo da imagem de capa',
      },
    },
    required: ['name', 'type', 'address', 'coverId'],
  },
};
