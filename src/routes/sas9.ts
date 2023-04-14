import express from 'express'
import { generateCSRFToken } from '../middlewares'
import { Sas9Controller } from '../controllers/sas9'
import { FileUploadController } from '../controllers/internal'

const sas9Router = express.Router()
// Mock controller must be singleton because it keeps the states
// for example `isLoggedIn` and potentially more in future mocks
const controller = new Sas9Controller()
const fileUploadController = new FileUploadController()

sas9Router.get('/', async (req, res) => {
  const codeToInject = `<script>document.cookie = 'XSRF-TOKEN=${generateCSRFToken()}; Max-Age=86400; SameSite=Strict; Path=/;'</script>`
  const response =
    '<html><head></head><body>Web Build is not present</body></html>'

  const injectedContent = response?.replace('</head>', `${codeToInject}</head>`)

  return res.send(injectedContent)
})

sas9Router.get('/SASStoredProcess', async (req, res) => {
  const response = await controller.sasStoredProcess(req)

  if (response.redirect) {
    res.redirect(response.redirect)
    return
  }

  try {
    res.send(response.content)
  } catch (err: any) {
    res.status(403).send(err.toString())
  }
})

sas9Router.get('/SASStoredProcess/do/', async (req, res) => {
  const response = await controller.sasStoredProcessDoGet(req)

  if (response.redirect) {
    res.redirect(response.redirect)
    return
  }

  try {
    res.send(response.content)
  } catch (err: any) {
    res.status(403).send(err.toString())
  }
})

sas9Router.post(
  '/SASStoredProcess/do/',
  fileUploadController.preUploadMiddleware,
  fileUploadController.getMulterUploadObject().any(),
  async (req, res) => {
    const response = await controller.sasStoredProcessDoPost(req)

    if (response.redirect) {
      res.redirect(response.redirect)
      return
    }

    try {
      res.send(response.content)
    } catch (err: any) {
      res.status(403).send(err.toString())
    }
  }
)

sas9Router.get('/SASLogon/login', async (req, res) => {
  const response = await controller.loginGet()

  if (response.redirect) {
    res.redirect(response.redirect)
    return
  }

  try {
    res.send(response.content)
  } catch (err: any) {
    res.status(403).send(err.toString())
  }
})

sas9Router.post('/SASLogon/login', async (req, res) => {
  const response = await controller.loginPost(req)

  if (response.redirect) {
    res.redirect(response.redirect)
    return
  }

  try {
    res.send(response.content)
  } catch (err: any) {
    res.status(403).send(err.toString())
  }
})

sas9Router.get('/SASLogon/logout', async (req, res) => {
  const response = await controller.logout(req)

  if (response.redirect) {
    res.redirect(response.redirect)
    return
  }

  try {
    res.send(response.content)
  } catch (err: any) {
    res.status(403).send(err.toString())
  }
})

sas9Router.get('/SASStoredProcess/Logoff', async (req, res) => {
  const response = await controller.logoff(req)

  if (response.redirect) {
    res.redirect(response.redirect)
    return
  }

  try {
    res.send(response.content)
  } catch (err: any) {
    res.status(403).send(err.toString())
  }
})

export default sas9Router
