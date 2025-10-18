import { Hono } from 'hono';
import { upload } from './images/upload';
import { verifyToken } from '@/http/middlewares/verifyToken';

const app = new Hono().basePath('/attachments');

app.use(verifyToken);
app.post('/images/upload', upload);

export { app as attachmentsRoutes };
