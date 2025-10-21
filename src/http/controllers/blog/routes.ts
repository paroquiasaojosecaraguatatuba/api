import { Hono } from 'hono';
import { categoriesRoutes } from './categories/routes';
import { verifyToken } from '@/http/middlewares/verifyToken';

const app = new Hono().basePath('/blog');

app.use(verifyToken);
app.route('/', categoriesRoutes);

export { app as blogRoutes };
