import { Hono } from 'hono';
import { editPostDraft } from './edit';
import { deletePostDraft } from './delete';
import { getPostDraft } from './get';
import { createPostDraft } from './create';
import { publishPostDraft } from './publish';

const app = new Hono().basePath('/post-drafts');

app.post('/', createPostDraft);
app.get('/:id', getPostDraft);
app.put('/:id', editPostDraft);
app.put('/:id/publish', publishPostDraft);
app.delete('/:id', deletePostDraft);

export { app as postDraftsRoutes };
