import express from 'express'
import responsesJson from '../../sasviya/responses.json'
import { SasViyaController } from '../controllers/sasviya'
import { handleReturnOrRedirect } from '../utils/handleReturnOrRedirect'

const sasViyaRouter = express.Router()
// Mock controller must be singleton because it keeps the states
// for example `isLoggedIn` and potentially more in future mocks
const controller = new SasViyaController()

sasViyaRouter.get('/', async (req, res) => {
  try {
    res.send({ welcome: 'to viya mocks' })
  } catch (err: any) {
    res.status(403).send(err.toString())
  }
})

sasViyaRouter.post('/SASJobExecution', async (req, res) => {
  const response = await controller.postSasJobExecution(req)
  
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

sasViyaRouter.get('/SASLogon/oauth/authorize', async (req, res) => {
  const response = await controller.oauthAuthorize(req)

  handleReturnOrRedirect(res, response)
})

export default sasViyaRouter
