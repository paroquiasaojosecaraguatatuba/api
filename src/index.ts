import { Hono } from 'hono';
import { healthCheck } from './http/controllers/health-check';
import { parseBody } from './http/middlewares/parseBody';
import { withDictionary } from './http/middlewares/withDictionary';
import { onAppError } from './http/middlewares/onAppError';
import { userRoutes } from './http/controllers/users/routes';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.get('/health-check', healthCheck);

app.use(withDictionary, parseBody);

app.route('/', userRoutes);

app.onError(onAppError);

export default app;
