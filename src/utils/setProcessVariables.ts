import path from 'path'
import { createFolder, getAbsolutePath, getRealPath } from '@sasjs/utils'

export const setProcessVariables = async () => {
  const { SASJS_ROOT, DRIVE_LOCATION, LOG_LOCATION } = process.env

  if (process.env.NODE_ENV === 'test') {
    process.sasjsRoot = path.join(process.cwd(), 'sasjs_root')
    process.driveLoc = path.join(process.cwd(), 'sasjs_root', 'drive')
    return
  }

  process.nodeLoc = process.env.NODE_PATH!

  const absPath = getAbsolutePath(SASJS_ROOT ?? 'sasjs_root', process.cwd())
  await createFolder(absPath)
  process.sasjsRoot = getRealPath(absPath)

  const absDrivePath = getAbsolutePath(
    DRIVE_LOCATION ?? path.join(process.sasjsRoot, 'drive'),
    process.cwd()
  )
  await createFolder(absDrivePath)
  process.driveLoc = getRealPath(absDrivePath)

  const {} = process.env
  const absLogsPath = getAbsolutePath(
    LOG_LOCATION ?? path.join(process.sasjsRoot, 'logs'),
    process.cwd()
  )
  await createFolder(absLogsPath)
  process.logsLoc = getRealPath(absLogsPath)

  process.logsUUID = 'SASJS_LOGS_SEPARATOR_163ee17b6ff24f028928972d80a26784'
}
