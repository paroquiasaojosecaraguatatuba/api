import { Hono } from 'hono';
import { editMassSchedule } from './edit';
import { deleteMassSchedule } from './delete';

const app = new Hono().basePath('/mass-schedules');

app.put('/:id', editMassSchedule);
app.delete('/:id', deleteMassSchedule);

export { app as massSchedulesRoutes };
