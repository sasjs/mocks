import path from 'path'
import { fileExists } from '@sasjs/utils'
import { getServicesFolder } from './file'

export const getFilePath = async (programPath: string) => {
  const filePath = path
    .join(getServicesFolder(), programPath)
    .replace(new RegExp('/', 'g'), path.sep)

  if (await fileExists(filePath)) {
    return filePath
  }

  throw `The Program at (${programPath}) does not exist.`
}
