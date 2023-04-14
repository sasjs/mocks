declare namespace NodeJS {
  export interface Process {
    nodeLoc: string
    driveLoc: string
    sasjsRoot: string
    logsLoc: string
    logger: import('@sasjs/utils/logger').Logger
  }
}
