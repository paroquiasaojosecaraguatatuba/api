import { Hono } from 'hono'
import { healthCheck } from './controllers/healthCheck'
import { login } from './controllers/login'
import { parseJSON } from './middlewares/parseJSON'
import { createUser } from './controllers/createUser'
import { onAppError } from './middlewares/onAppError'
import { ensureAdminAuth } from './middlewares/ensureAdminAuth'

const app = new Hono<{Bindings: Bindings}>()

app.get('/health-check', healthCheck)

app.post('/user', parseJSON, ensureAdminAuth, createUser)
app.post('/login', parseJSON, login)

app.onError(onAppError)

export default app
