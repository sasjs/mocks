import path from 'path'
import { fileExists } from '@sasjs/utils'
import { getFilesFolder } from './file'

export const getFilePath = async (programPath: string) => {
  const filePath = path
    .join(getFilesFolder(), programPath)
    .replace(new RegExp('/', 'g'), path.sep)

  if (await fileExists(filePath)) {
    return filePath
  }

  throw `The Program at (${programPath}) does not exist.`
}
