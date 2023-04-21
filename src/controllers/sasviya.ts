import express, { response } from 'express'
import { Get, Post, Request } from "tsoa"
import responsesJson from '../../sasviya/responses.json'
import { loginForm } from '../../sasviya/login-form'

export interface SasViyaResponse {
  content: any
  type?: 'text' | 'json'
  redirect?: string
  status?: number
  error?: boolean
}

export class SasViyaController {
  private loggedInUser: string | undefined
  private jobsWaitCounter = 1
  private authorizedEndpoints: string[] = []

  @Get('/SASLogon/login')
  public async getLogin(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
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
      type: 'text'
    }
  }

  @Post('/SASLogon/login.do')
  public async login(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    this.loggedInUser = req.body.username

    return {
      content: '',
      redirect: '/../'
    }
  }

  @Get('/SASLogon/logout.do')
  public async logout(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    return {
      content: "/SASLogon/login"
    }
  }

  @Get('/SASLogon/oauth/authorize')
  public async oauthAuthorize(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
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

  @Get('/SASDrive')
  public async getSasDrive(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
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

  @Get('/identities')
  public async getIdentities(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    const redirectToSub = req.query.state 
    const redirect = `${redirectToSub}?state=auth`

    return {
      content: '',
      redirect: redirect
    }
  }

  @Get('/identities/users/@currentUser')
  public async getCrrentUser(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
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

  @Post('/SASJobExecution')
  public async postSasJobExecution(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    return {
      content: 'test'
    }
  }

  @Get('/folders')
  public async getFolders(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    const redirectToSub = req.query.state 
    const redirect = `${redirectToSub}?state=auth`

    return {
      content: '',
      redirect: redirect
    }
  }

  @Get('/folders/folders/@item')
  public async getFoldersByItem(
    @Request() req: express.Request
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

  @Get('/folders/folders/:id/members')
  public async getFolderMembers(
    @Request() req: express.Request
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

    const jsonResponse = responsesJson['/folders/folders/:id/members']

    return {
      content: jsonResponse
    }
  }

  @Get('/files')
  public async getFiles(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    const redirectToSub = req.query.state 
    const redirect = `${redirectToSub}?state=auth`

    return {
      content: '',
      redirect: redirect
    }
  }

  @Get('/files/files/:id/content')
  public async getFileContent(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    const state = req.query.state
    const urlWithoutQuery = req.originalUrl.split('?')[0]

    if (state !== 'auth') {
      const redirect = `/SASLogon/oauth/authorize?client_id=sas.files&redirect_uri=/files/&response_type=code&state=${urlWithoutQuery}`
      return {
        content: '',
        redirect: redirect
      }
    }

    // Actual service response
    const jsonResponse = { "SYSDATE": "26SEP22", "SYSTIME": "08:29", "sasdatasets": [{ "LIBREF": "DC996664", "DSN": "MPE_X_TEST" }, { "LIBREF": "DC996664", "DSN": "MPE_DATADICTIONARY" }, { "LIBREF": "DC996664", "DSN": "MPE_USERS" }, { "LIBREF": "DC996664", "DSN": "MPE_TABLES" }], "saslibs": [{ "LIBREF": "DC996664" }], "globvars": [{ "DCLIB": "DC996664", "SAS9LINEAGE_ENABLED": 1, "ISREGISTERED": 1, "REGISTERCOUNT": 1, "DC_ADMIN_GROUP": "Data Management Business Approvers", "LICENCE_KEY": "", "ACTIVATION_KEY": "", "DC_RESTRICT_EDITRECORD": "NO" }], "_DEBUG": "", "_METAUSER": "sasdemo@SAS", "_METAPERSON": "sasdemo", "_PROGRAM": "/Projects/app/dc/services/public/startupservice", "AUTOEXEC": "D%3A%5Copt%5Csasinside%5CConfig%5CLev1%5CSASApp%5CStoredProcessServer%5Cautoexec.sas", "MF_GETUSER": "sasdemo", "SYSCC": "0", "SYSENCODING": "wlatin1", "SYSERRORTEXT": "", "SYSHOSTNAME": "SAS", "SYSPROCESSID": "41DD8056944A8F5C409C500000000000", "SYSPROCESSMODE": "SAS Stored Process Server", "SYSPROCESSNAME": "", "SYSJOBID": "27448", "SYSSCPL": "Linunx", "SYSSITE": "123", "SYSUSERID": "sassrv", "SYSVLONG": "9.04.01M7P080520", "SYSWARNINGTEXT": "ENCODING option ignored for files opened with RECFM=N.", "END_DTTM": "2022-09-26T08:29:06.092000", "MEMSIZE": "46GB" }

    return {
      content: jsonResponse
    }
  }

  @Get('/jobDefinitions')
  public async getJobDefinitions(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    const redirectToSub = req.query.state 
    const redirect = `${redirectToSub}?state=auth`

    return {
      content: '',
      redirect: redirect
    }
  }

  @Get('/jobDefinitions/definitions/:id')
  public async getJobDefinitionDetails(
    @Request() req: express.Request
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

  @Post('/jobExecution/jobs')
  public async submitJob(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    const jsonResponse = responsesJson['/jobExecution/jobs']

    return {
      content: jsonResponse
    }
  }

  @Get('/jobExecution/jobs/:id')
  public async getJob(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    const jsonResponse = responsesJson['/jobExecution/jobs/:id']

    return {
      content: jsonResponse
    }
  }

  @Get('/jobExecution/jobs/:id/state')
  public async getJobState(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
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