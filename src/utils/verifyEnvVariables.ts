export enum MOCK_SERVER_TYPEType {
  SAS9 = 'sas9',
  SASVIYA = 'sasviya'
}

export enum ReturnCode {
  Success,
  InvalidEnv
}

export enum LOG_FORMAT_MORGANType {
  Combined = 'combined',
  Common = 'common',
  Dev = 'dev',
  Short = 'short',
  tiny = 'tiny'
}

export const verifyEnvVariables = (): ReturnCode => {
  const errors: string[] = []

  errors.push(...verifyExecutablePaths())
  errors.push(...verifyMockServerType())
  errors.push(...verifyPORT())
  errors.push(...verifyLOG_FORMAT_MORGAN())

  if (errors.length) {
    process.logger?.error(
      `Invalid environment variable(s) provided: \n${errors.join('\n')}`
    )
    return ReturnCode.InvalidEnv
  }

  return ReturnCode.Success
}

const verifyExecutablePaths = (): string[] => {
  const errors: string[] = []
  const { NODE_PATH } = process.env

  if (!NODE_PATH) {
    errors.push(`- NODE_PATH is required`)
  }

  return errors
}

const verifyMockServerType = (): string[] => {
  const errors: string[] = []
  const { MOCK_SERVER_TYPE } = process.env

  if (MOCK_SERVER_TYPE) {
    const mockServerTypes = Object.values(MOCK_SERVER_TYPEType)
    if (!mockServerTypes.includes(MOCK_SERVER_TYPE as MOCK_SERVER_TYPEType))
      errors.push(
        `- MOCK_SERVER_TYPE '${MOCK_SERVER_TYPE}'\n - valid options ${mockServerTypes}`
      )
  } else {
    process.env.MOCK_SERVER_TYPE = DEFAULTS.MOCK_SERVER_TYPE
  }

  return errors
}

const verifyPORT = (): string[] => {
  const errors: string[] = []
  const { PORT } = process.env

  if (PORT) {
    if (Number.isNaN(parseInt(PORT)))
      errors.push(`- PORT '${PORT}'\n - should be a valid number`)
  } else {
    process.env.PORT = DEFAULTS.PORT
  }
  return errors
}

const verifyLOG_FORMAT_MORGAN = (): string[] => {
  const errors: string[] = []
  const { LOG_FORMAT_MORGAN } = process.env

  if (LOG_FORMAT_MORGAN) {
    const logFormatMorganTypes = Object.values(LOG_FORMAT_MORGANType)
    if (
      !logFormatMorganTypes.includes(LOG_FORMAT_MORGAN as LOG_FORMAT_MORGANType)
    )
      errors.push(
        `- LOG_FORMAT_MORGAN '${LOG_FORMAT_MORGAN}'\n - valid options ${logFormatMorganTypes}`
      )
    LOG_FORMAT_MORGAN
  } else {
    process.env.LOG_FORMAT_MORGAN = DEFAULTS.LOG_FORMAT_MORGAN
  }
  return errors
}

const DEFAULTS = {
  MOCK_SERVER_TYPE: MOCK_SERVER_TYPEType.SAS9,
  PORT: '5000',
  LOG_FORMAT_MORGAN: LOG_FORMAT_MORGANType.Common
}
