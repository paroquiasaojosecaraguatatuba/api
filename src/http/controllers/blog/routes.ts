import { Hono } from 'hono';
import { categoriesRoutes } from './categories/routes';
import { verifyToken } from '@/http/middlewares/verifyToken';
import { draftsRoutes } from './drafts/routes';

const app = new Hono().basePath('/blog');

app.use(verifyToken);
app.route('/', categoriesRoutes);
app.route('/', draftsRoutes);

export { app as blogRoutes };
