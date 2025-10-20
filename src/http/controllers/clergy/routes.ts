import { Hono } from 'hono';
import { createClergy } from './create';
import { editClergy } from './edit';
import { deleteClergy } from './delete';
import { listClergy } from './list';

const app = new Hono().basePath('/clergy');

app.get('/', listClergy);
app.post('/', createClergy);
app.patch('/', editClergy);
app.delete('/', deleteClergy);

export { app as clergyRoutes };
