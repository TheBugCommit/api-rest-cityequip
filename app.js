import'dotenv/config'
import express from 'express'
import routerV1 from './routes/v1/router.js'
import middlewares from './middlewares/index.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
if (process.env.ENV && process.env.ENV == "prod")
    app.use(middlewares.corsMiddleware)

app.use(middlewares.responseHandler)
app.use('/api/v1', routerV1)
app.use((req, res, next) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  })
})
app.use(middlewares.errorHandler)

export default app