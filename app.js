import express from 'express'
import routerV1 from './routes/v1/router.js'
import { corsMiddleware } from './middlewares/cors.middleware.js'
import dotenv from 'dotenv'

dotenv.config()
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
if (process.env.ENV && process.env.ENV == "prod")
    app.use(corsMiddleware)

app.use('/api/v1', routerV1)

export default app