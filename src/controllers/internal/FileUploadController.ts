import { Request, RequestHandler } from 'express'
import multer from 'multer'
import { uuidv4 } from '@sasjs/utils'
import { SessionController } from '.'
import { executeProgramRawValidation } from '../../utils'

export class FileUploadController {
  private storage = multer.diskStorage({
    destination: function (req: Request, file: any, cb: any) {
      //Sending the intercepted files to the sessions subfolder
      cb(null, req.sasjsSession?.path)
    },
    filename: function (req: Request, file: any, cb: any) {
      //req_file prefix + unique hash added to sas request files
      cb(null, `req_file_${uuidv4().replace(/-/gm, '')}`)
    }
  })

  private upload = multer({ storage: this.storage })

  //It will intercept request and generate unique uuid to be used as a subfolder name
  //that will store the files uploaded
  public preUploadMiddleware: RequestHandler = async (req, res, next) => {
    const { error: errQ, value: query } = executeProgramRawValidation(req.query)
    const { error: errB, value: body } = executeProgramRawValidation(req.body)

    if (errQ && errB) return res.status(400).send(errB.details[0].message)

    const sessionController = new SessionController()
    const session = await sessionController.getSession()

    req.sasjsSession = session

    next()
  }

  public getMulterUploadObject() {
    return this.upload
  }
}
