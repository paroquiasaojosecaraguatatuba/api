import { attachmentPaths } from '../paths/attachments';
import { communityPaths } from '../paths/communities';
import { userPaths } from '../paths/users';
import { commonSchemas } from '../schemas/common';
import { communitySchemas } from '../schemas/communities';
import { userSchemas } from '../schemas/users';

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Paróquia São José API',
    description: 'API para gerenciamento de comunidades paroquiais',
    version: '1.0.0',
    contact: {
      name: 'Giselle Hoekveld Silva',
      email: 'gisellehoekveld.contato@gmail.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3333',
      description: 'Servidor de Desenvolvimento',
    },
    {
      url: 'https://api.paroquiasaojosecaraguatatuba.workers.dev',
      description: 'Servidor de Produção',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'Custom-HMAC256',
        description:
          'Token de autenticação customizado usando HMAC-256. Formato: Bearer {token}',
      },
    },
    schemas: {
      ...userSchemas,
      ...communitySchemas,
      ...commonSchemas,
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    ...userPaths,
    ...attachmentPaths,
    ...communityPaths,
  },
  tags: [
    {
      name: 'Users',
      description: 'Operações relacionadas com usuários do sistema',
    },
    {
      name: 'Attachments',
      description: 'Operações relacionadas com anexos de arquivos',
    },
    {
      name: 'Communities',
      description:
        'Operações relacionadas com comunidades religiosas (capelas e paróquias)',
    },
  ],
};

export default openApiSpec;
