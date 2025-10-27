import { Hono } from 'hono';
import { createMassSchedule } from './create';
import { listMassSchedules } from './list';

const app = new Hono().basePath('/mass-schedules');

app.get('/', listMassSchedules);
app.post('/', createMassSchedule);

export { app as massSchedulesRoutes };
