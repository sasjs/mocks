import path from 'path'
import { MulterFile } from '../types/Upload'
import { listFilesInFolder, isWindows } from '@sasjs/utils'

interface FilenameMapSingle {
  fieldName: string
  originalName: string
}

interface FilenamesMap {
  [key: string]: FilenameMapSingle
}

/**
 * It will create an object that maps hashed file names to the original names
 * @param files array of files to be mapped
 * @returns object
 */
export const makeFilesNamesMap = (files: MulterFile[]) => {
  if (!files) return null

  const filesNamesMap: FilenamesMap = {}

  for (let file of files) {
    filesNamesMap[file.filename] = {
      fieldName: file.fieldname,
      originalName: file.originalname
    }
  }

  return filesNamesMap
}

/**
 * Generates the js code that references uploaded files in the concurrent request
 * @param filesNamesMap object that maps hashed file names and original file names
 * @param sessionFolder name of the folder that is created for the purpose of files in concurrent request
 * @returns generated js code
 */
export const generateFileUploadJSCode = async (
  filesNamesMap: FilenamesMap,
  sessionFolder: string
) => {
  let uploadCode = ''
  let fileCount = 0

  const sessionFolderList: string[] = await listFilesInFolder(sessionFolder)
  sessionFolderList.forEach(async (fileName) => {
    if (fileName.includes('req_file')) {
      fileCount++
      const filePath = path.join(sessionFolder, fileName)
      uploadCode += `\nconst _WEBIN_FILEREF${fileCount} = fs.readFileSync('${
        isWindows() ? filePath.replace(/\\/g, '\\\\') : filePath
      }')`
      uploadCode += `\nconst _WEBIN_FILENAME${fileCount} = '${filesNamesMap[fileName].originalName}'`
      uploadCode += `\nconst _WEBIN_NAME${fileCount} = '${filesNamesMap[fileName].fieldName}'`
    }
  })

  uploadCode += `\nconst _WEBIN_FILE_COUNT = ${fileCount}`

  return uploadCode
}
