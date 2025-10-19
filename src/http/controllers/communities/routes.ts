import { Hono } from 'hono';
import { verifyToken } from '@/http/middlewares/verifyToken';
import { createCommunity } from './create';
import { editCommunity } from './edit';
import { deleteCommunity } from './delete';
import { listCommunities } from './list';

const app = new Hono().basePath('/communities');

app.use(verifyToken);
app.get('/', listCommunities);
app.post('/', createCommunity);
app.put('/:id', editCommunity);
app.delete('/:id', deleteCommunity);

export { app as communitiesRoutes };
