import { Hono } from 'hono';
import { editMassSchedule } from './edit';
import { createMassSchedule } from './create';
import { listMassSchedules } from './list';
import { deleteMassSchedule } from './delete';

const app = new Hono().basePath('/mass-schedules');

app.get('/', listMassSchedules);
app.post('/', createMassSchedule);
app.put('/:id', editMassSchedule);
app.delete('/:id', deleteMassSchedule);

export { app as massSchedulesRoutes };
