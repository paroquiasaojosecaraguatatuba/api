import { swaggerUI } from '@hono/swagger-ui';
import { getAppContext } from '../utils/getAppContext';

export const withSwaggerUI: MiddlewareFn = async (c, next) => {
  const { locale } = getAppContext(c);

  return swaggerUI<Env>({
    url: `/docs/${locale}/openapi.json`,
    deepLinking: true,
    displayRequestDuration: true,
    layout: 'BaseLayout',
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true,
    defaultModelsExpandDepth: -1, // Não expande modelos
    defaultModelExpandDepth: 0, // Não expande propriedades dos modelos
    docExpansion: 'list', // Só mostra lista de endpoints
    persistAuthorization: true, // Mantém token após refresh
    displayOperationId: false,
    showMutabledRequest: true,
  })(c, next);
};
