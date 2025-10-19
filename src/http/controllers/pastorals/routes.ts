import { Hono } from 'hono';
import { verifyToken } from '@/http/middlewares/verifyToken';
import { createPastoral } from './create';
import { editPastoral } from './edit';
import { deletePastoral } from './delete';
import { listPastorals } from './list';

const app = new Hono().basePath('/pastorals');

app.use(verifyToken);
app.get('/', listPastorals);
app.post('/', createPastoral);
app.put('/:id', editPastoral);
app.delete('/:id', deletePastoral);

export { app as pastoralsRoutes };
