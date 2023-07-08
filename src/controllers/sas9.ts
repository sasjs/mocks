import { readFile } from '@sasjs/utils'
import express from 'express'
import path from 'path'
import { MulterFile } from '../types/Upload'
import { getFilePath, makeFilesNamesMap } from '../utils'
import { ExecutionController } from './internal'

export interface Sas9Response {
  content: string
  redirect?: string
  error?: boolean
}

export interface MockFileRead {
  content: string
  error?: boolean
}

export class Sas9Controller {
  private loggedInUser: string | undefined
  private mocksPath = process.env.STATIC_MOCK_LOCATION || '.'

  public async sasStoredProcess(req: express.Request): Promise<Sas9Response> {
    const username = req.query._username?.toString() || undefined
    const password = req.query._password?.toString() || undefined

    if (username && password) this.loggedInUser = req.body.username

    if (!this.loggedInUser) {
      return {
        content: '',
        redirect: '/SASLogon/login'
      }
    }

    let program = req.query._program?.toString() || undefined
    const filePath: string[] = program
      ? program.replace('/', '').split('/')
      : ['generic', 'sas-stored-process']

    // Explanation ?
    if (program) {
      return await getMockResponseFromFile([
        process.cwd(),
        this.mocksPath,
        'sas9',
        ...filePath
      ])
    }

    return await getMockResponseFromFile([
      process.cwd(),
      this.mocksPath,
      'sas9',
      ...filePath
    ])
  }

  public async sasStoredProcessDoGet(
    req: express.Request
  ): Promise<Sas9Response> {
    const username = req.query._username?.toString() || undefined
    const password = req.query._password?.toString() || undefined

    if (username && password) this.loggedInUser = username

    if (!this.loggedInUser) {
      return {
        content: '',
        redirect: '/SASLogon/login'
      }
    }

    const program = req.query._program ?? req.body?._program
    const filePath: string[] = ['generic', 'sas-stored-process']

    if (program) {
      const vars = { ...req.query, ...req.body, _requestMethod: req.method }
      const otherArgs = {}

      try {
        const codePath = await getFilePath(program + '.js')

        // todo: set session from req.sasjsSession
        const result = await new ExecutionController().executeFile({
          programPath: codePath,
          vars: vars,
          otherArgs: otherArgs,
          session: req.sasjsSession,
          forceStringResult: true
        })

        return {
          content: result.result as string
        }
      } catch (err) {
        process.logger.error('err', err)
      }

      return {
        content: 'No webout returned.'
      }
    }

    return await getMockResponseFromFile([
      process.cwd(),
      this.mocksPath,
      'sas9',
      ...filePath
    ])
  }

  public async sasStoredProcessDoPost(
    req: express.Request
  ): Promise<Sas9Response> {
    if (!this.loggedInUser) {
      return {
        content: '',
        redirect: '/SASLogon/login'
      }
    }

    if (this.isPublicAccount()) {
      return {
        content: '',
        redirect: '/SASLogon/Login'
      }
    }

    const program = req.query._program ?? req.body?._program
    const vars = {
      ...req.query,
      ...req.body,
      _requestMethod: req.method,
      _driveLoc: process.driveLoc
    }
    
    const filesNamesMap = req.files?.length
      ? makeFilesNamesMap(req.files as MulterFile[])
      : null
      
    const otherArgs = { filesNamesMap: filesNamesMap }
    const codePath = await getFilePath(program + '.js')

    try {
      const result = await new ExecutionController().executeFile({
        programPath: codePath,
        vars: vars,
        otherArgs: otherArgs,
        session: req.sasjsSession,
        forceStringResult: true
      })

      return {
        content: result.result as string
      }
    } catch (err) {
      process.logger.error('err', err)
    }

    return {
      content: 'No webout returned.'
    }
  }

  public async loginGet(): Promise<Sas9Response> {
    if (this.loggedInUser) {
      if (this.isPublicAccount()) {
        return {
          content: '',
          redirect: '/SASStoredProcess/Logoff?publicDenied=true'
        }
      } else {
        return await getMockResponseFromFile([
          process.cwd(),
          this.mocksPath,
          'sas9',
          'generic',
          'logged-in'
        ])
      }
    }

    return await getMockResponseFromFile([
      process.cwd(),
      this.mocksPath,
      'sas9',
      'generic',
      'login'
    ])
  }

  public async loginPost(req: express.Request): Promise<Sas9Response> {
    if (req.body.lt && req.body.lt !== 'validtoken')
      return {
        content: '',
        redirect: '/SASLogon/login'
      }

    this.loggedInUser = req.body.username

    return await getMockResponseFromFile([
      process.cwd(),
      this.mocksPath,
      'sas9',
      'generic',
      'logged-in'
    ])
  }

  public async logout(req: express.Request): Promise<Sas9Response> {
    this.loggedInUser = undefined

    if (req.query.publicDenied === 'true') {
      return await getMockResponseFromFile([
        process.cwd(),
        this.mocksPath,
        'sas9',
        'generic',
        'public-access-denied'
      ])
    }

    return await getMockResponseFromFile([
      process.cwd(),
      this.mocksPath,
      'sas9',
      'generic',
      'logged-out'
    ])
  }

  //publicDenied=true
  public async logoff(req: express.Request): Promise<Sas9Response> {
    const params = req.query.publicDenied
      ? `?publicDenied=${req.query.publicDenied}`
      : ''

    return {
      content: '',
      redirect: '/SASLogon/logout' + params
    }
  }

  private isPublicAccount = () => this.loggedInUser?.toLowerCase() === 'public'
}

const getMockResponseFromFile = async (
  filePath: string[]
): Promise<MockFileRead> => {
  const filePathParsed = path.join(...filePath)
  let error: boolean = false

  let file = await readFile(filePathParsed).catch((err: any) => {
    const errMsg = `Error reading mocked file on path: ${filePathParsed}\nError: ${err}`
    process.logger.error(errMsg)

    error = true

    return errMsg
  })

  return {
    content: file,
    error: error
  }
}
