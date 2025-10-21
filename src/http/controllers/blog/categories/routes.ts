import { Hono } from 'hono';
import { listCategories } from './list';
import { createCategory } from './create';
import { editCategory } from './edit';
import { deleteCategory } from './delete';

const app = new Hono().basePath('/categories');

app.get('/', listCategories);
app.post('/', createCategory);
app.put('/:id', editCategory);
app.delete('/:id', deleteCategory);

export { app as categoriesRoutes };
