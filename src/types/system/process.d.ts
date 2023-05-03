declare namespace NodeJS {
  export interface Process {
    nodeLoc: string
    driveLoc: string
    sasjsRoot: string
    servicesLoc: string
    logsUUID: string
    logsLoc: string
    logger: import('@sasjs/utils/logger').Logger
  }
}
