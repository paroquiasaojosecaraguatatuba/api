import { Hono } from 'hono';
import { jsonDoc } from '@/http/controllers/docs/json';
import { withLocale } from '@/http/middlewares/withLocale';
import { withSwaggerUI } from '@/http/middlewares/withSwaggerUI';

const app = new Hono().basePath('/docs');

app.get('/openapi.json', withLocale, jsonDoc);
app.get('/:locale/openapi.json', withLocale, jsonDoc);
app.get('/', withLocale, withSwaggerUI);
app.get('/:locale', withLocale, withSwaggerUI);

export { app as docsRoutes };
