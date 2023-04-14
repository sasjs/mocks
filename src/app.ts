import dotenv from 'dotenv'
import express, { ErrorRequestHandler } from 'express'
import { configureLogger } from './app-modules'
import {
  ReturnCode,
  instantiateLogger,
  setProcessVariables,
  verifyEnvVariables
} from './utils'
import cors from 'cors'

dotenv.config()

instantiateLogger()

if (verifyEnvVariables()) process.exit(ReturnCode.InvalidEnv)

const app = express()

app.use(cors({credentials: true, origin: true}))

export default setProcessVariables().then(async () => {
  configureLogger(app)

  // loading these modules after setting up variables due to
  // multer's usage of process var process.driveLoc
  const { setupRoutes } = await import('./routes/setupRoutes')
  setupRoutes(app)

  app.use(onError)

  return app
})

const onError: ErrorRequestHandler = (err, req, res, next) => {
  process.logger.error(err.stack)
  res.status(500).send('Something broke!')
}
