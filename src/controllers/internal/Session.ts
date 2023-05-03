import path from 'path'
import { Session } from '../../types'
import { getSessionsFolder, generateUniqueFileName } from '../../utils'
import { createFile, generateTimestamp } from '@sasjs/utils'

export class SessionController {
  protected async createSession(): Promise<Session> {
    const sessionId = generateUniqueFileName(generateTimestamp())
    const sessionFolder = path.join(getSessionsFolder(), sessionId)

    const session: Session = {
      id: sessionId,
      path: sessionFolder
    }

    const headersPath = path.join(session.path, 'stpsrv_header.txt')
    await createFile(headersPath, 'content-type: text/html; charset=utf-8')

    return session
  }

  public async getSession() {
    return this.createSession()
  }
}
