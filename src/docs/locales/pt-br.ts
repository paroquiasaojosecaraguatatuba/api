import { attachmentPaths } from '../paths/attachments';
import { communityPaths } from '../paths/communities';
import { pastoralPaths } from '../paths/pastorals';
import { userPaths } from '../paths/users';
import { commonSchemas } from '../schemas/common';
import { communitySchemas } from '../schemas/communities';
import { pastoralSchemas } from '../schemas/pastorals';
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
      description: 'Desenvolvimento - Ambiente Local',
    },
    {
      url: 'https://api.paroquiasaojosecaraguatatuba.workers.dev',
      description: 'Staging - Ambiente de Testes',
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
      ...pastoralSchemas,
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
    ...pastoralPaths,
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
    {
      name: 'Pastorals',
      description: 'Operações relacionadas com pastorais da igreja',
    },
  ],
};

export default openApiSpec;
