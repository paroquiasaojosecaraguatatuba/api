import { Hono } from 'hono';
import { healthCheck } from './http/controllers/health-check';
import { parseBody } from './http/middlewares/parseBody';
import { withDictionary } from './http/middlewares/withDictionary';
import { onAppError } from './http/middlewares/onAppError';
import { userRoutes } from './http/controllers/users/routes';
import { attachmentsRoutes } from './http/controllers/attachments/routes';
import { communitiesRoutes } from './http/controllers/communities/routes';
import { docsRoutes } from './docs/routes';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.get('/health-check', healthCheck);

app.use(withDictionary, parseBody);

app.route('/', userRoutes);
app.route('/', communitiesRoutes);
app.route('/', attachmentsRoutes);
app.route('/', docsRoutes);

app.onError(onAppError);

export default app;
