import path from 'path'
import { WriteStream, createWriteStream } from 'fs'
import { execFile } from 'child_process'
import { once } from 'stream'
import { createFile } from '@sasjs/utils'
import { Session } from '../../types'
import { ExecutionVars, createJSProgram } from './'

export const processProgram = async (
  program: string,
  vars: ExecutionVars,
  session: Session,
  weboutPath: string,
  headersPath: string,
  logPath: string,
  otherArgs?: any
) => {
  program = await createJSProgram(
    program,
    vars,
    session,
    weboutPath,
    headersPath,
    otherArgs
  )
  const codePath = path.join(session.path, 'code.js')
  const executablePath = process.nodeLoc!

  await createFile(codePath, program)

  // create a stream that will write to console outputs to log file
  const writeStream = createWriteStream(logPath)
  // waiting for the open event so that we can have underlying file descriptor
  await once(writeStream, 'open')

  await execFilePromise(executablePath, [codePath], writeStream)
    .then(() => {
      process.logger.info('session completed', session)
    })
    .catch((err) => {
      session.crashed = err.toString()
      process.logger.error('session crashed', session.id, session.crashed)
    })

  // copy the code file to log and end write stream
  writeStream.end(program)
}

/**
 * Promisified child_process.execFile
 *
 * @param file - The name or path of the executable file to run.
 * @param args - List of string arguments.
 * @param writeStream - Child process stdout and stderr will be piped to it.
 *
 * @returns {Promise<{ stdout: string, stderr: string }>}
 */
const execFilePromise = (
  file: string,
  args: string[],
  writeStream: WriteStream
): Promise<{ stdout: string; stderr: string }> => {
  return new Promise((resolve, reject) => {
    const child = execFile(file, args, (err, stdout, stderr) => {
      if (err) reject(err)

      resolve({ stdout, stderr })
    })

    child.stdout?.on('data', (data) => {
      writeStream.write(data)
    })

    child.stderr?.on('data', (data) => {
      writeStream.write(data)
    })
  })
}
