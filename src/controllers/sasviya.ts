import express from 'express'
import responsesJson from '../../sasviya/responses.json'
import { loginForm } from '../../sasviya/login-form'
import { getFilePath } from '../utils'
import { ExecutionController } from './internal'
import { SasViyaResponse } from '../types/viya/sas-viya-response'
import { SasViyaResponseType } from '../types/viya/sas-viya-response-type'

export class SasViyaController {
  private loggedInUser: string | undefined
  private jobsWaitCounter = 1
  private authorizedEndpoints: string[] = []

  // contains service execution results to be returned when requested trough /files/files API
  public executionResults: string[] = []

  // @Get("/SASLogon/login")
  public async getLogin(req: express.Request): Promise<SasViyaResponse> {
    const acceptJson = req.headers.accept === 'application/json'

    const jsonResponse = responsesJson['/SASLogon/login']
    const formResponse = loginForm

    if (acceptJson) {
      return {
        content: jsonResponse
      }
    }

    return {
      content: formResponse,
      type: SasViyaResponseType.text
    }
  }

  // @Post("/SASLogon/login.do")
  public async login(req: express.Request): Promise<SasViyaResponse> {
    this.loggedInUser = req.body.username

    return {
      content: '',
      redirect: '/../'
    }
  }

  // @Get("/SASLogon/logout.do")
  public async logout(req: express.Request): Promise<SasViyaResponse> {
    return {
      content: '/SASLogon/login'
    }
  }

  // @Get("/SASLogon/oauth/authorize")
  public async oauthAuthorize(req: express.Request): Promise<SasViyaResponse> {
    const redirect_uri = req.query.redirect_uri
    const code = req.query.code
    const state = req.query.state

    let redirect = `${redirect_uri}?state=${state}`

    if (!this.loggedInUser) redirect = '/SASLogon/login'

    return {
      content: '',
      redirect: redirect
    }
  }

  // @Get("/SASDrive")
  public async getSasDrive(req: express.Request): Promise<SasViyaResponse> {
    const code = req.query.code

    if (code) {
      return {
        content: '',
        redirect: '/SASDrive'
      }
    }

    return {
      content: 'SAS Drive'
    }
  }

  // @Post("/SASJobExecution")
  public async executeJob(req: express.Request): Promise<SasViyaResponse> {
    const program = req.query._program

    const vars = {
      ...req.query,
      ...req.body.variables,
      _requestMethod: req.method,
      _driveLoc: process.driveLoc
    }

    const otherArgs = {}

    let jsonResponse = {}

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

      jsonResponse = result.result

      process.logger.info(`Execution of (${program}) successfull`)
    } catch (err) {
      process.logger.error('err', err)
    }

    return {
      content: jsonResponse
    }
  }

  // @Get("/compute/contexts")
  public async getContexts(req: express.Request): Promise<SasViyaResponse> {
    const jsonResponse = responsesJson['/compute/contexts']

    return {
      content: jsonResponse
    }
  }

  // @Post("/compute/contexts/:id/sessions")
  public async createNewSession(
    req: express.Request
  ): Promise<SasViyaResponse> {
    const jsonResponse = responsesJson['/compute/contexts/:id/sessions']

    return {
      content: jsonResponse
    }
  }

  // @Post("/compute/sessions/:id/jobs")
  public async createSessionJob(
    req: express.Request
  ): Promise<SasViyaResponse> {
    const body = req.body
    const program = req.body.variables._program

    const vars = {
      ...req.query,
      ...req.body.variables,
      _requestMethod: req.method,
      _driveLoc: process.driveLoc
    }

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

      const resultString = result.result as string
      this.executionResults.push(resultString)

      process.logger.info(`Execution of (${program}) successfull`)
    } catch (err) {
      process.logger.error('err', err)
    }

    const jsonResponse = responsesJson['/compute/sessions/:id/jobs']

    return {
      content: jsonResponse
    }
  }

  // @Get("/compute/sessions/:id/jobs/:id")
  public async getSessionJob(req: express.Request): Promise<SasViyaResponse> {
    const jsonResponse = responsesJson['/compute/sessions/:id/jobs/:id']

    return {
      content: jsonResponse
    }
  }

  // @Get("/compute/sessions/:id/jobs/:id/state")
  public async getSessionJobState(
    req: express.Request
  ): Promise<SasViyaResponse> {
    if (this.jobsWaitCounter > 10) {
      this.jobsWaitCounter = 1

      return {
        content: 'completed'
      }
    } else {
      this.jobsWaitCounter++

      return {
        content: 'running'
      }
    }
  }

  // @Get("/compute/sessions/:id/state")
  public async getSessionState(req: express.Request): Promise<SasViyaResponse> {
    if (this.jobsWaitCounter > 10) {
      this.jobsWaitCounter = 1

      return {
        content: 'completed'
      }
    } else {
      this.jobsWaitCounter++

      return {
        content: 'running'
      }
    }
  }

  // @Get("/compute/sessions/:id/filerefs/_webout/content")
  public async getSessionContent(
    req: express.Request
  ): Promise<SasViyaResponse> {
    const executedServiceResponse =
      this.executionResults.shift() || 'No webout returned'
    let jsonResponse = {}

    try {
      jsonResponse = JSON.parse(executedServiceResponse)
    } catch (err) {
      return {
        content: err,
        error: true
      }
    }

    return {
      content: jsonResponse
    }
  }

  // @Delete("/compute/sessions/:id")
  public async deleteSession(req: express.Request): Promise<SasViyaResponse> {
    return {
      content: '',
      status: 204
    }
  }

  // @Get("/identities")
  public async getIdentities(req: express.Request): Promise<SasViyaResponse> {
    const redirectToSub = req.query.state
    const redirect = `${redirectToSub}?state=auth`

    return {
      content: '',
      redirect: redirect
    }
  }

  // @Get("/identities/users/@currentUser")
  public async getCrrentUser(req: express.Request): Promise<SasViyaResponse> {
    const state = req.query.state
    const urlWithoutQuery = req.originalUrl.split('?')[0]

    if (state !== 'auth') {
      const redirect = `/SASLogon/oauth/authorize?client_id=sas.identities&redirect_uri=/identities/&response_type=code&state=${urlWithoutQuery}`

      return {
        content: '',
        redirect: redirect
      }
    }

    const jsonResponse = responsesJson['/identities/users/@currentUser']

    return {
      content: jsonResponse
    }
  }

  // @Get("/folders")
  public async getFolders(req: express.Request): Promise<SasViyaResponse> {
    const redirectToSub = req.query.state
    const redirect = `${redirectToSub}?state=auth`

    return {
      content: '',
      redirect: redirect
    }
  }

  // @Get("/folders/folders/@item")
  public async getFoldersByItem(
    req: express.Request
  ): Promise<SasViyaResponse> {
    const state = req.query.state
    const urlWithoutQuery = req.originalUrl.split('?')[0]

    if (state !== 'auth') {
      const redirect = `/SASLogon/oauth/authorize?client_id=sas.files&redirect_uri=/folders/&response_type=code&state=${urlWithoutQuery}`
      return {
        content: '',
        redirect: redirect
      }
    }

    const jsonResponse = responsesJson['folders/folders/@item']

    return {
      content: jsonResponse
    }
  }

  // @Get("/folders/folders/:id/members")
  public async getFolderMembers(
    req: express.Request
  ): Promise<SasViyaResponse> {
    const state = req.query.state
    const urlWithoutQuery = req.originalUrl.split('?')[0]

    if (state !== 'auth') {
      const redirect = `/SASLogon/oauth/authorize?client_id=sas.files&redirect_uri=/folders/&response_type=code&state=${urlWithoutQuery}`
      return {
        content: '',
        redirect: redirect
      }
    }

    // In the response we include all jobs
    // but in real scenario, adapter sends another request to re-populate members again
    // That bit should be considered in future
    const jsonResponse = responsesJson['/folders/folders/:id/members']

    return {
      content: jsonResponse
    }
  }

  // @Get("/files")
  public async getFiles(req: express.Request): Promise<SasViyaResponse> {
    const redirectToSub = req.query.state
    const redirect = `${redirectToSub}?state=auth`

    return {
      content: '',
      redirect: redirect
    }
  }

  // @Post("/files/files")
  public async postFile(req: express.Request): Promise<SasViyaResponse> {
    const jsonResponse = responsesJson['/files/files']

    return {
      content: jsonResponse
    }
  }

  // @Get("/files/files/:id/content")
  public async getFileContent(req: express.Request): Promise<SasViyaResponse> {
    const state = req.query.state
    const urlWithoutQuery = req.originalUrl.split('?')[0]

    if (state !== 'auth') {
      const redirect = `/SASLogon/oauth/authorize?client_id=sas.files&redirect_uri=/files/&response_type=code&state=${urlWithoutQuery}`
      return {
        content: '',
        redirect: redirect
      }
    }

    const executedServiceResponse =
      this.executionResults.shift() || 'No webout returned'
    let jsonResponse = {}

    try {
      jsonResponse = JSON.parse(executedServiceResponse)
    } catch (err) {
      return {
        content: err,
        error: true
      }
    }

    return {
      content: jsonResponse
    }
  }

  // @Get("/jobDefinitions")
  public async getJobDefinitions(
    req: express.Request
  ): Promise<SasViyaResponse> {
    const redirectToSub = req.query.state
    const redirect = `${redirectToSub}?state=auth`

    return {
      content: '',
      redirect: redirect
    }
  }

  // @Get("/jobDefinitions/definitions/:id")
  public async getJobDefinitionDetails(
    req: express.Request
  ): Promise<SasViyaResponse> {
    const state = req.query.state
    const urlWithoutQuery = req.originalUrl.split('?')[0]

    if (state !== 'auth') {
      const redirect = `/SASLogon/oauth/authorize?client_id=sas.jobExecution&redirect_uri=/jobDefinitions/&response_type=code&state=${urlWithoutQuery}`
      return {
        content: '',
        redirect: redirect
      }
    }

    const jsonResponse = responsesJson['/jobDefinitions/definitions/:id']

    return {
      content: jsonResponse
    }
  }

  // @Post("/jobExecution/jobs")
  public async submitJob(req: express.Request): Promise<SasViyaResponse> {
    const body = req.body
    const program = body.arguments._program

    const vars = {
      ...req.query,
      ...req.body.variables,
      _requestMethod: req.method,
      _driveLoc: process.driveLoc
    }

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

      const resultString = result.result as string
      this.executionResults.push(resultString)

      process.logger.info(`Execution of (${program}) successfull`)
    } catch (err) {
      process.logger.error('err', err)
    }

    const jsonResponse = responsesJson['/jobExecution/jobs']

    return {
      content: jsonResponse
    }
  }

  // @Get("/jobExecution/jobs/:id")
  public async getJob(req: express.Request): Promise<SasViyaResponse> {
    const jsonResponse = responsesJson['/jobExecution/jobs/:id']

    return {
      content: jsonResponse
    }
  }

  // @Get("/jobExecution/jobs/:id/state")
  public async getJobState(req: express.Request): Promise<SasViyaResponse> {
    // We will keep it as a reference if needed later
    // const wait = req.query.wait ? parseInt((req.query.wait).toString()) : 100

    if (this.jobsWaitCounter > 10) {
      this.jobsWaitCounter = 1

      return {
        content: 'completed'
      }
    } else {
      this.jobsWaitCounter++

      return {
        content: 'running'
      }
    }
  }
}
