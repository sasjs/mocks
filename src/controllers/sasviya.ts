import express from 'express'
import { Get, Post, Request } from "tsoa"
import responsesJson from '../../sasviya/responses.json'

export interface SasViyaResponse {
    content: any
    redirect?: string
    error?: boolean
}

export class SasViyaController {
    private jobsWaitCounter = 1

    @Get('/SASLogon/oauth/authorize')
    public async oauthAuthorize(
        @Request() req: express.Request
    ): Promise<SasViyaResponse> {
        const redirect_uri = req.query.redirect_uri
        const code = req.query.code

        const redirect = `${redirect_uri}?code=${code}state=h8ohNe`

        return {
            content: '',
            redirect: redirect
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

    @Get('/folders/folders/@item')
    public async getFoldersByItem(
        @Request() req: express.Request
    ): Promise<SasViyaResponse> {
        const path = req.query.path || ''
        const jsonResponse = responsesJson['folders/folders/@item']

        return {
            content: jsonResponse
        }
    }

    @Get('/folders/folders/:id/members')
    public async getFolderMembers(
        @Request() req: express.Request
    ): Promise<SasViyaResponse> {
        const query = req.query
        const jsonResponse = responsesJson['/folders/folders/:id/members']

        return {
            content: jsonResponse
        }
    }

    @Get('/files')
    public async getFiles(
        @Request() req: express.Request
    ): Promise<SasViyaResponse> {
        const query = req.query
        const redirect = '/files/files/7a1fd83b-ee21-4cfc-af67-18f3e5aaade0/content?auth=1'

        return {
            content: '',
            redirect: redirect
        }
    }

    @Get('/files/files/:id/content')
    public async getFileContent(
        @Request() req: express.Request
    ): Promise<SasViyaResponse> {
        const query = req.query

        if (query.auth && query.auth === '1') {
            const jsonResponse = {"SYSDATE" : "26SEP22","SYSTIME" : "08:29", "sasdatasets":[{"LIBREF": "DC996664","DSN": "MPE_X_TEST"},{  "LIBREF": "DC996664",  "DSN": "MPE_DATADICTIONARY"},{  "LIBREF": "DC996664",  "DSN": "MPE_USERS"},{    "LIBREF": "DC996664",    "DSN": "MPE_TABLES"}], "saslibs":[{"LIBREF": "DC996664"}], "globvars":[{"DCLIB": "DC996664","SAS9LINEAGE_ENABLED": 1,"ISREGISTERED": 1,"REGISTERCOUNT": 1,"DC_ADMIN_GROUP": "Data Management Business Approvers","LICENCE_KEY": "","ACTIVATION_KEY": "","DC_RESTRICT_EDITRECORD": "NO"}],"_DEBUG" : "","_METAUSER": "sasdemo@SAS","_METAPERSON": "sasdemo","_PROGRAM" : "/Projects/app/dc/services/public/startupservice","AUTOEXEC" : "D%3A%5Copt%5Csasinside%5CConfig%5CLev1%5CSASApp%5CStoredProcessServer%5Cautoexec.sas","MF_GETUSER" : "sasdemo","SYSCC" : "0","SYSENCODING" : "wlatin1","SYSERRORTEXT" : "","SYSHOSTNAME" : "SAS","SYSPROCESSID" : "41DD8056944A8F5C409C500000000000","SYSPROCESSMODE" : "SAS Stored Process Server","SYSPROCESSNAME" : "","SYSJOBID" : "27448","SYSSCPL" : "Linunx","SYSSITE" : "123","SYSUSERID" : "sassrv","SYSVLONG" : "9.04.01M7P080520","SYSWARNINGTEXT" : "ENCODING option ignored for files opened with RECFM=N.","END_DTTM" : "2022-09-26T08:29:06.092000","MEMSIZE" : "46GB"}
            
            return {
                content: jsonResponse
            }
        } else {
            const redirect = '/SASLogon/oauth/authorize?client_id=sas.files&redirect_uri=/files/&response_type=code&state=gh_lHB'
            return {
                content: '',
                redirect: redirect
            }
        }
    }

    @Get('/jobDefinitions')
    public async getJobDefinitions(
        @Request() req: express.Request
    ): Promise<SasViyaResponse> {
        const query = req.query
        const redirect = '/jobDefinitions/definitions/3e527ba2-5783-43b1-ad42-6f52f49fd8bf?auth=1'

        return {
            content: '',
            redirect: redirect
        }
    }

    @Get('/jobDefinitions/definitions/:id')
    public async getJobDefinitionDetails(
        @Request() req: express.Request
    ): Promise<SasViyaResponse> {
        const query = req.query

        if (query.auth && query.auth === '1') {
            const jsonResponse = responsesJson['/jobDefinitions/definitions/:id']
            
            return {
                content: jsonResponse
            }
        } else {
            const redirect = '/SASLogon/oauth/authorize?client_id=sas.jobExecution&redirect_uri=/jobDefinitions/&response_type=code&state=h8ohNe'
            return {
                content: '',
                redirect: redirect
            }
        }
    }

    @Post('/jobExecution/jobs')
    public async submitJob(
        @Request() req: express.Request
    ): Promise<SasViyaResponse> {
        const query = req.query
        const jsonResponse = responsesJson['/jobExecution/jobs']

        return {
            content: jsonResponse
        }
    }

    @Get('/jobExecution/jobs/:id')
    public async getJob(
        @Request() req: express.Request
    ): Promise<SasViyaResponse> {
        const query = req.query
        const jsonResponse = responsesJson['/jobExecution/jobs/:id']

        return {
            content: jsonResponse
        }
    }

    @Get('/jobExecution/jobs/:id/state')
    public async getJobState(
        @Request() req: express.Request
    ): Promise<SasViyaResponse> {
        const action = req.query._action
        const wait = req.query.wait ? parseInt((req.query.wait).toString()) : 100

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