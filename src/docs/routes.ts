// src/docs/routes.ts
import { Hono } from 'hono';
import { swaggerUI } from '@hono/swagger-ui';
import { openApiSpec } from './openapi-spec';

const app = new Hono().basePath('/docs');

function getLocale(acceptLanguage = ''): string {
  const supportedLocales = ['pt-BR', 'en'];
  const requestedLocales = acceptLanguage
    .split(',')
    .map((lang) => lang.split(';')[0].trim())
    .map((lang) => {
      // Mapear pt para pt-BR
      if (lang === 'pt') return 'pt-BR';
      return lang;
    });

  for (const locale of requestedLocales) {
    if (supportedLocales.includes(locale)) {
      return locale;
    }
  }

  return 'en'; // Fallback
}

// ✅ Spec dinâmico baseado no idioma
app.get('/openapi.json', (c) => {
  const acceptLanguage = c.req.header('Accept-Language') || '';
  const locale = getLocale(acceptLanguage);

  return c.json(openApiSpec(locale));
});

// ✅ Endpoint específico por idioma (opcional)
app.get('/:locale/openapi.json', (c) => {
  const { locale } = c.req.param();
  const supportedLocales = ['pt-BR', 'en'];

  if (!supportedLocales.includes(locale)) {
    return c.json({ error: 'Unsupported locale' }, 400);
  }

  return c.json(openApiSpec(locale));
});

// ✅ UI dinâmica
app.get('/', (c, next) => {
  return swaggerUI({
    url: '/docs/openapi.json',
    deepLinking: true,
    displayRequestDuration: true,
    layout: 'BaseLayout',
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true,
  })(c, next);
});

// ✅ UI específica por idioma
app.get('/:locale', async (c, next) => {
  const { locale } = c.req.param();
  const supportedLocales = ['pt-BR', 'en'];

  if (!supportedLocales.includes(locale)) {
    return c.redirect('/docs/');
  }

  return swaggerUI({
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
    // ✅ Configurações de autenticação
    persistAuthorization: true, // Mantém token após refresh
    displayOperationId: false,
    showMutabledRequest: true,
  })(c, next);
});

export { app as docsRoutes };
