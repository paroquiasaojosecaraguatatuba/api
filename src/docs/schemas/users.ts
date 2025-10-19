export const userSchemas = {
  User: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: '01K7WCX2R48A8NJYWAFQN3KCN8',
        description: 'Identificador único no formato ULID',
      },
      email: {
        type: 'string',
        format: 'email',
        example: 'janedoe@example.com',
        description: 'Endereço de email do usuário',
      },
      role: {
        type: 'string',
        example: 'admin',
        description: 'Função do usuário no sistema',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-10-18T21:26:36.811Z',
        description: 'Timestamp de criação do usuário',
      },
    },
    required: ['id', 'email', 'role', 'createdAt'],
  },
  RegisterUserRequest: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        example: 'joaodasilva@example.com',
        description: 'Endereço de email do usuário',
      },
      password: {
        type: 'string',
        format: 'password',
        example: 'SenhaSegura123!',
        description: 'Senha do usuário (mínimo 8 caracteres)',
      },
      role: {
        type: 'string',
        example: 'user',
        description: 'Função do usuário no sistema (ex: user, admin, viewer)',
      },
    },
    required: ['name', 'email', 'password'],
  },
};
