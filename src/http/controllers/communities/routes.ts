import { Hono } from 'hono';
import { verifyToken } from '@/http/middlewares/verifyToken';
import { createCommunity } from './create';
import { editCommunity } from './edit';
import { deleteCommunity } from './delete';

const app = new Hono().basePath('/communities');

app.use(verifyToken);
app.post('/', createCommunity);
app.put('/:id', editCommunity);
app.delete('/:id', deleteCommunity);

export { app as communitiesRoutes };
