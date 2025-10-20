import { Hono } from 'hono';
import { createClergy } from './create';
import { editClergy } from './edit';
import { deleteClergy } from './delete';

const app = new Hono().basePath('/clergy');

app.post('/', createClergy);
app.patch('/', editClergy);
app.delete('/', deleteClergy);

export { app as clergyRoutes };
