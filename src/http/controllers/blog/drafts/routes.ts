import { Hono } from 'hono';
import { listDrafts } from './list';
import { getDraft } from './get';
import { createDraft } from './create';
import { editDraft } from './edit';
import { deleteDraft } from './delete';

const app = new Hono().basePath('/drafts');

app.get('/', listDrafts);
app.get('/:slug', getDraft);
app.post('/', createDraft);
app.put('/:id', editDraft);
app.delete('/:id', deleteDraft);

export { app as draftsRoutes };
