import { Hono } from 'hono';
import { listPosts } from './list';
import { unpublishPost } from './unpublish';

const app = new Hono().basePath('/posts');

app.get('/', listPosts);
app.post('/:id/unpublish', unpublishPost);

export { app as postsRoutes };
