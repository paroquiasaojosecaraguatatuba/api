import { Hono } from 'hono';
import { healthCheck } from './http/controllers/health-check';
import { parseJSON } from './http/middlewares/parseJSON';
import { withDictionary } from './http/middlewares/withDictionary';
import { withD1Database } from './http/middlewares/withD1Database';
import { onAppError } from './http/middlewares/onAppError';
import { userRoutes } from './http/controllers/users/routes';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.get('/health-check', healthCheck);

app.use(withDictionary, parseJSON, withD1Database);

app.route('/', userRoutes);

app.onError(onAppError);

export default app;
