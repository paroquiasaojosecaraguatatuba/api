export const commonSchemas = {
  UnauthorizedResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: 'Token inválido ou expirado.',
      },
    },
    required: ['message'],
  },
  ErrorResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example:
          'Ocorreu um erro no servidor. Por favor, tente novamente mais tarde.',
      },
    },
    required: ['message'],
  },
  InvalidCredentialsResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: 'Email ou senha inválidos.',
      },
    },
  },
  ResourceNotFoundResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: 'Comunidade não encontrada.',
      },
    },
    required: ['message'],
  },
};
