import fs from 'fs-extra'
import path from 'path'

export const getSasjsRootFolder = () => process.sasjsRoot

export const getSasjsDriveFolder = () => process.driveLoc

export const getLogFolder = () => process.logsLoc

export const getServicesFolder = () => process.servicesLoc

export const getUploadsFolder = () => path.join(getSasjsRootFolder(), 'uploads')

export const getFilesFolder = () => path.join(getSasjsDriveFolder(), 'files')

export const getWeboutFolder = () => path.join(getSasjsRootFolder(), 'webouts')

export const getSessionsFolder = () =>
  path.join(getSasjsRootFolder(), 'sessions')

export const generateUniqueFileName = (fileName: string, extension = '') =>
  [
    fileName,
    '-',
    Math.round(Math.random() * 100000),
    '-',
    new Date().getTime(),
    extension
  ].join('')

export const createReadStream = async (filePath: string) =>
  fs.createReadStream(filePath)
