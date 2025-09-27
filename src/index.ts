import { Hono } from 'hono'
import { healthCheck } from './routes/healthCheck'

const app = new Hono()

app.get('/health-check', healthCheck)

export default app
