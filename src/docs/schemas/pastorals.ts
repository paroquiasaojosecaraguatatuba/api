export const pastoralSchemas = {
  Pastoral: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: '01K7WHHBXWKXWYWE9ZCY88MG2Z',
        description: 'Identificador único no formato ULID',
      },
      name: {
        type: 'string',
        example: 'Pastoral da Caridade',
        description: 'Nome da pastoral',
      },
      description: {
        type: 'string',
        example: 'Pastoral dedicada ao auxílio dos necessitados na comunidade.',
        description: 'Descrição da pastoral',
      },
      responsibleName: {
        type: 'string',
        example: 'João da Silva',
        description: 'Nome do responsável pela pastoral',
      },
      contactPhone: {
        type: 'string',
        example: '+55 12 34567-8901',
        description: 'Telefone de contato da pastoral',
      },
      coverId: {
        type: 'string',
        example: '01K7WHHBXWKXWYWE9ZCY88MG2Z',
        description: 'ID do anexo da imagem de capa',
      },
    },
    required: [
      'id',
      'name',
      'description',
      'responsibleName',
      'contactPhone',
      'coverId',
    ],
  },
  CreatePastoralRequest: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        example: 'Pastoral da Caridade',
        description: 'Nome da pastoral',
      },
      description: {
        type: 'string',
        example: 'Pastoral dedicada ao auxílio dos necessitados na comunidade.',
        description: 'Descrição da pastoral',
      },
      responsibleName: {
        type: 'string',
        example: 'João da Silva',
        description: 'Nome do responsável pela pastoral',
      },
      contactPhone: {
        type: 'string',
        example: '+55 12 34567-8901',
        description: 'Telefone de contato da pastoral',
      },
      coverId: {
        type: 'string',
        example: '01K7WHHBXWKXWYWE9ZCY88MG2Z',
        description: 'ID do anexo da imagem de capa',
      },
    },
    required: [
      'name',
      'description',
      'responsibleName',
      'contactPhone',
      'coverId',
    ],
  },
};
