import { createFolder, generateTimestamp, getAbsolutePath } from '@sasjs/utils'
import { Express } from 'express'
import morgan from 'morgan'
import path from 'path'
import { createStream } from 'rotating-file-stream'

const createLogsFolder = async () => {
  const { LOG_LOCATION } = process.env
  const absLogsPath = getAbsolutePath(LOG_LOCATION ?? 'logs', process.cwd())
  await createFolder(absLogsPath)
  return absLogsPath
}

export const configureLogger = async (app: Express) => {
  const { LOG_FORMAT_MORGAN } = process.env

  let options
  if (
    process.env.NODE_ENV !== 'development' &&
    process.env.NODE_ENV !== 'test'
  ) {
    const logsFolder = await createLogsFolder()
    const timestamp = generateTimestamp()
    const filename = `${timestamp}.log`

    // create a rotating write stream
    var accessLogStream = createStream(filename, {
      interval: '1d', // rotate daily
      path: logsFolder
    })

    process.logger.info('Writing Logs to :', path.join(logsFolder, filename))

    options = { stream: accessLogStream }
  }

  // setup the logger
  app.use(morgan(LOG_FORMAT_MORGAN as string, options))
}
