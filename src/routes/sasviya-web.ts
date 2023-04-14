import express from 'express'
import responsesJson from '../../sasviya/responses.json'

const sasViyaRouter = express.Router()

let jobsWaitCounter = 1

sasViyaRouter.get('/', async (req, res) => {
  try {
    res.send({ welcome: 'to viya mocks' })
  } catch (err: any) {
    res.status(403).send(err.toString())
  }
})

sasViyaRouter.post('/SASJobExecution/', async (req, res) => {
  try {
    res.send({ test: 'test' })
  } catch (err: any) {
    res.status(403).send(err.toString())
  }
})

sasViyaRouter.get('/folders/folders/@item', async (req, res) => {
  const path = req.query.path || ''
  
  const jsonResponse = responsesJson['folders/folders/@item']

  try {
    res.send(jsonResponse)
  } catch (err: any) {
    res.status(403).send(err.toString())
  }
})

sasViyaRouter.get('/folders/folders/:id/members', async (req, res) => {
  const query = req.query
  
  const jsonResponse = responsesJson['/folders/folders/:id/members']

  try {
    res.send(jsonResponse)
  } catch (err: any) {
    res.status(403).send(err.toString())
  }
})

sasViyaRouter.get('/files', async (req, res) => {
  const query = req.query
  const redirect = '/files/files/7a1fd83b-ee21-4cfc-af67-18f3e5aaade0/content?auth=1'

  try {
    res.redirect(redirect)
  } catch (err: any) {
    res.status(403).send(err.toString())
  }
})

// This is SERVICE RESPONSE (eg startupservice)
sasViyaRouter.get('/files/files/:id/content', async (req, res) => {
  const query = req.query

  if (query.auth && query.auth === '1') {
    const jsonResponse = {"SYSDATE" : "26SEP22","SYSTIME" : "08:29", "sasdatasets":[{"LIBREF": "DC996664","DSN": "MPE_X_TEST"},{  "LIBREF": "DC996664",  "DSN": "MPE_DATADICTIONARY"},{  "LIBREF": "DC996664",  "DSN": "MPE_USERS"},{    "LIBREF": "DC996664",    "DSN": "MPE_TABLES"}], "saslibs":[{"LIBREF": "DC996664"}], "globvars":[{"DCLIB": "DC996664","SAS9LINEAGE_ENABLED": 1,"ISREGISTERED": 1,"REGISTERCOUNT": 1,"DC_ADMIN_GROUP": "Data Management Business Approvers","LICENCE_KEY": "","ACTIVATION_KEY": "","DC_RESTRICT_EDITRECORD": "NO"}],"_DEBUG" : "","_METAUSER": "sasdemo@SAS","_METAPERSON": "sasdemo","_PROGRAM" : "/Projects/app/dc/services/public/startupservice","AUTOEXEC" : "D%3A%5Copt%5Csasinside%5CConfig%5CLev1%5CSASApp%5CStoredProcessServer%5Cautoexec.sas","MF_GETUSER" : "sasdemo","SYSCC" : "0","SYSENCODING" : "wlatin1","SYSERRORTEXT" : "","SYSHOSTNAME" : "SAS","SYSPROCESSID" : "41DD8056944A8F5C409C500000000000","SYSPROCESSMODE" : "SAS Stored Process Server","SYSPROCESSNAME" : "","SYSJOBID" : "27448","SYSSCPL" : "Linunx","SYSSITE" : "123","SYSUSERID" : "sassrv","SYSVLONG" : "9.04.01M7P080520","SYSWARNINGTEXT" : "ENCODING option ignored for files opened with RECFM=N.","END_DTTM" : "2022-09-26T08:29:06.092000","MEMSIZE" : "46GB"}
    res.send(jsonResponse)
  } else {
    const redirect = '/SASLogon/oauth/authorize?client_id=sas.files&redirect_uri=/files/&response_type=code&state=gh_lHB'
    res.redirect(redirect)
  }
})

sasViyaRouter.get('/jobDefinitions', async (req, res) => {
  const query = req.query
  const redirect = '/jobDefinitions/definitions/3e527ba2-5783-43b1-ad42-6f52f49fd8bf?auth=1'

  try {
    res.redirect(redirect)
  } catch (err: any) {
    res.status(403).send(err.toString())
  }
})

sasViyaRouter.get('/jobDefinitions/definitions/:id', async (req, res) => {
  const query = req.query

  if (query.auth && query.auth === '1') {
    const jsonResponse = responsesJson['/jobDefinitions/definitions/:id']
    res.send(jsonResponse) 
  } else {
    const redirect = '/SASLogon/oauth/authorize?client_id=sas.jobExecution&redirect_uri=/jobDefinitions/&response_type=code&state=h8ohNe'
    res.redirect(redirect)
  }
})

sasViyaRouter.post('/jobExecution/jobs', async (req, res) => {
  const query = req.query

  const jsonResponse = responsesJson['/jobExecution/jobs']

  res.send(jsonResponse)
})

sasViyaRouter.get('/jobExecution/jobs/:id/state', async (req, res) => {
  const action = req.query._action
  const wait = req.query.wait ? parseInt((req.query.wait).toString()) : 100

  if (jobsWaitCounter > 10) {
    jobsWaitCounter = 1
    res.send('completed')
  } else {
    jobsWaitCounter++
    res.send('running')
  }
})

sasViyaRouter.get('/jobExecution/jobs/:id', async (req, res) => {
  const query = req.query

  const jsonResponse = responsesJson['/jobExecution/jobs/:id']

  res.send(jsonResponse)
})

sasViyaRouter.get('/SASLogon/oauth/authorize', async (req, res) => {
  const redirect_uri = req.query.redirect_uri
  const code = req.query.code

  const redirect = `${redirect_uri}?code=${code}state=h8ohNe`

  try {
    res.redirect(redirect)
  } catch (err: any) {
    res.status(403).send(err.toString())
  }
})

export default sasViyaRouter
