import { Express, Router } from 'express'
import { MOCK_SERVER_TYPEType } from '../utils'
import sasViyaRouter from './sasviya-web'

export const setupRoutes = (app: Express) => {
  const router = Router()

  const { MOCK_SERVER_TYPE } = process.env

  if (MOCK_SERVER_TYPE === MOCK_SERVER_TYPEType.SASVIYA) {
    router.use('/', sasViyaRouter)
  } else {
    router.use('/', function (req, res, next) {
      res.send('sas 9 mock router')
    })
  }

  app.use('/', router)
}
