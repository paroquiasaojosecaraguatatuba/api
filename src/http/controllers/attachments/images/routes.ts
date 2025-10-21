import { Hono } from 'hono';
import { verifyToken } from '@/http/middlewares/verifyToken';
import { upload } from './upload';

const app = new Hono().basePath('/images');

app.use(verifyToken);
app.post('/', upload);

export { app as imagesRoutes };
