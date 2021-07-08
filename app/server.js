const express = require('express')
const cors = require('cors')
const pinoHttp = require('pino-http')
const { PORT } = require('./env')
const logger = require('./logger')
const router = require('./routes')
const health = require('./routes/health')
const auth = require('./routes/auth')
const checkJwt = require('./auth')

async function createHttpServer() {
  const requestLogger = pinoHttp({ logger })
  const app = express()

  app.use(express.json())
  app.use(cors())
  app.use((req, res, next) => {
    if (req.path !== '/health') {
      requestLogger(req, res)
    }
    next()
  })

  app.use('/health', health)
  app.use('/auth', auth)
  app.use('/', checkJwt, router)

  return app
}

async function startServer() {
  const app = await createHttpServer()

  app.listen(PORT, (err) => {
    if (err) {
      logger.error('Error  starting app:', err)
      throw err
    } else {
      logger.info(`Server is listening on port ${PORT}`)
    }
  })
}

module.exports = { startServer, createHttpServer }
