import express from 'express'
import responsesJson from '../../sasviya/responses.json'
import { SasViyaController } from '../controllers/sasviya'
import { handleReturnOrRedirect } from '../utils/handleReturnOrRedirect'

const sasViyaRouter = express.Router()
// Mock controller must be singleton because it keeps the states
// for example `isLoggedIn` and potentially more in future mocks
const controller = new SasViyaController()

sasViyaRouter.get('/', async (req, res) => {
  res.redirect('/SASLogon/oauth/authorize?client_id=sas.SASDrive&redirect_uri=%2FSASDrive%2F&response_type=code&state=cc316985-8fca-4b45-8689-5082fbc9690b')
})

sasViyaRouter.get('/SASLogon/login', async (req, res) => {
  const response = await controller.getLogin(req)

  handleReturnOrRedirect(res, response)
})

sasViyaRouter.get('/SASLogon/logout.do', async (req, res) => {
  const response = await controller.logout(req)

  handleReturnOrRedirect(res, response)
})


sasViyaRouter.post('/SASLogon/login.do', async (req, res) => {
  const response = await controller.login(req)

  handleReturnOrRedirect(res, response)
})

sasViyaRouter.get('/SASLogon/oauth/authorize', async (req, res) => {
  const response = await controller.oauthAuthorize(req)

  handleReturnOrRedirect(res, response)
})

sasViyaRouter.get('/SASDrive', async (req, res) => {
  const response = await controller.getSasDrive(req)

  handleReturnOrRedirect(res, response)
})

sasViyaRouter.get('/identities', async (req, res) => {
  const response = await controller.getIdentities(req)

  handleReturnOrRedirect(res, response)
})

sasViyaRouter.get('/identities/users/@currentUser', async (req, res) => {
  const response = await controller.getCrrentUser(req)

  handleReturnOrRedirect(res, response)
})

sasViyaRouter.post('/SASJobExecution', async (req, res) => {
  const response = await controller.postSasJobExecution(req)
  
  handleReturnOrRedirect(res, response)
})

sasViyaRouter.get('/folders', async (req, res) => {
  const response = await controller.getFolders(req)

  handleReturnOrRedirect(res, response)
})

sasViyaRouter.get('/folders/folders/@item', async (req, res) => {
  const response = await controller.getFoldersByItem(req)

  handleReturnOrRedirect(res, response)
})

sasViyaRouter.get('/folders/folders/:id/members', async (req, res) => {
  const response = await controller.getFolderMembers(req)

  handleReturnOrRedirect(res, response)
})

sasViyaRouter.get('/files', async (req, res) => {
  const response = await controller.getFiles(req)

  handleReturnOrRedirect(res, response)
})

// This is SERVICE RESPONSE (eg startupservice)
sasViyaRouter.get('/files/files/:id/content', async (req, res) => {
  const response = await controller.getFileContent(req)

  handleReturnOrRedirect(res, response)
})

sasViyaRouter.get('/jobDefinitions', async (req, res) => {
  const response = await controller.getJobDefinitions(req)

  handleReturnOrRedirect(res, response)
})

sasViyaRouter.get('/jobDefinitions/definitions/:id', async (req, res) => {
  const response = await controller.getJobDefinitionDetails(req)

  handleReturnOrRedirect(res, response)
})

sasViyaRouter.post('/jobExecution/jobs', async (req, res) => {
  const response = await controller.submitJob(req)

  handleReturnOrRedirect(res, response)
})

sasViyaRouter.get('/jobExecution/jobs/:id/state', async (req, res) => {
  const response = await controller.getJobState(req)
  
  handleReturnOrRedirect(res, response)
})

sasViyaRouter.get('/jobExecution/jobs/:id', async (req, res) => {
  const response = await controller.getJob(req)
  
  handleReturnOrRedirect(res, response)
})

export default sasViyaRouter
