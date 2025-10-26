import { Hono } from 'hono';
import { categoriesRoutes } from './categories/routes';
import { verifyToken } from '@/http/middlewares/verifyToken';
import { draftsRoutes } from './drafts/routes';
import { postsRoutes } from './posts/routes';
import { postDraftsRoutes } from './post-drafts/routes';

const app = new Hono().basePath('/blog');

app.use(verifyToken);
app.route('/', categoriesRoutes);
app.route('/', draftsRoutes);
app.route('/', postsRoutes);
app.route('/', postDraftsRoutes);

export { app as blogRoutes };
