import dotenv from 'dotenv'
import express, { ErrorRequestHandler, Express } from 'express'
import { configureLogger } from './app-modules'
import { setupRoutes } from './routes/setupRoutes'
import { ReturnCode, instantiateLogger, verifyEnvVariables } from './utils'

dotenv.config()

instantiateLogger()

if (verifyEnvVariables()) process.exit(ReturnCode.InvalidEnv)

const onError: ErrorRequestHandler = (err, req, res, next) => {
  process.logger.error(err.stack)
  res.status(500).send('Something broke!')
}

const appPromise = new Promise<Express>(async (resolve) => {
  const app = express()
  await configureLogger(app)

  setupRoutes(app)
  app.use(onError)

  resolve(app)
})

appPromise.then((app) => {
  const port = process.env.PORT || 5000

  app.listen(port, () => {
    process.logger.info(
      `⚡️[server]: Server is running at http://localhost:${port}`
    )
  })
})
