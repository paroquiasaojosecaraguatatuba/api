import { Hono } from 'hono';
import { verifyToken } from '@/http/middlewares/verifyToken';
import { imagesRoutes } from './images/routes';

const app = new Hono().basePath('/attachments');

app.use(verifyToken);
app.route('/', imagesRoutes);

export { app as attachmentsRoutes };
