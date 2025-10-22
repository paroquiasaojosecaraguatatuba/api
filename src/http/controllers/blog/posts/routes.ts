import { Hono } from 'hono';
import { listPosts } from './list';

const app = new Hono().basePath('/posts');

app.get('/', listPosts);

export { app as postsRoutes };
