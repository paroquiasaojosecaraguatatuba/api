import { Hono } from 'hono'
import { healthCheck } from './controllers/healthCheck'
import { login } from './controllers/login'
import { parseJSON } from './middlewares/parseJSON'
import { createUser } from './controllers/createUser'
import { onAppError } from './middlewares/onAppError'
import { ensureAdminAuth } from './middlewares/ensureAdminAuth'
import { parseLanguage } from './middlewares/parseLanguage'
import { withD1Database } from './middlewares/withD1Database'

const app = new Hono<{Bindings: Bindings; Variables: Variables}>()

app.get('/health-check', healthCheck)

app.use(parseJSON, parseLanguage, withD1Database)

app.post('/login',login)
app.post('/user', ensureAdminAuth, createUser)

app.onError(onAppError)

export default app
