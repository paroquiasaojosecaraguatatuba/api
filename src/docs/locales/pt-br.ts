import { attachmentPaths } from '../paths/attachments';
import { blogCategoryPaths } from '../paths/blog/categories';
import { blogDraftPaths } from '../paths/blog/drafts';
import { clergyPaths } from '../paths/clergy';
import { communityPaths } from '../paths/communities';
import { pastoralPaths } from '../paths/pastorals';
import { userPaths } from '../paths/users';
import { blogCategorySchemas } from '../schemas/blog/categories';
import { blogDraftsSchemas } from '../schemas/blog/drafts';
import { clergySchemas } from '../schemas/clergy';
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
      ...clergySchemas,
      ...blogCategorySchemas,
      ...blogDraftsSchemas,
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
    ...clergyPaths,
    ...blogCategoryPaths,
    ...blogDraftPaths,
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
      name: 'Clergy',
      description: 'Operações relacionadas com clérigos da igreja',
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
    {
      name: 'BlogCategories',
      description: 'Operações relacionadas com categorias do blog',
    },
    {
      name: 'BlogDrafts',
      description: 'Operações relacionadas com rascunhos do blog',
    },
  ],
};

export default openApiSpec;
