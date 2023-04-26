import path from "path";
import { SessionController, processProgram } from "./";
import { readFile, fileExists, createFile, readFileBinary } from "@sasjs/utils";
import { Session } from "../../types";
import { extractHeaders, HTTPHeaders, isDebugOn } from "../../utils";

export interface ExecutionVars {
  [key: string]: string | number | undefined;
}

export interface ExecuteReturnRaw {
  httpHeaders: HTTPHeaders;
  result: string | Buffer;
}

interface ExecuteFileParams {
  programPath: string;
  vars: ExecutionVars;
  otherArgs?: any;
  returnJson?: boolean;
  session?: Session;
  forceStringResult?: boolean;
}

interface ExecuteProgramParams extends Omit<ExecuteFileParams, "programPath"> {
  program: string;
}

export class ExecutionController {
  async executeFile({
    programPath,
    vars,
    otherArgs,
    returnJson,
    session,
    forceStringResult,
  }: ExecuteFileParams) {
    const program = await readFile(programPath);

    return this.executeProgram({
      program,
      vars,
      otherArgs,
      returnJson,
      session,
      forceStringResult,
    });
  }

  async executeProgram({
    program,
    vars,
    otherArgs,
    session: sessionByFileUpload,
    forceStringResult,
  }: ExecuteProgramParams): Promise<ExecuteReturnRaw> {
    const sessionController = new SessionController();

    const session =
      sessionByFileUpload ?? (await sessionController.getSession());

    const logPath = path.join(session.path, "log.log");
    const headersPath = path.join(session.path, "stpsrv_header.txt");

    const weboutPath = path.join(session.path, "webout.txt");

    await createFile(weboutPath, "");

    await processProgram(
      program,
      vars,
      session,
      weboutPath,
      headersPath,
      logPath,
      otherArgs
    );

    const log = (await fileExists(logPath)) ? await readFile(logPath) : "";
    const headersContent = (await fileExists(headersPath))
      ? await readFile(headersPath)
      : "";
    const httpHeaders: HTTPHeaders = extractHeaders(headersContent);

    if (isDebugOn(vars)) {
      httpHeaders["content-type"] = "text/plain";
    }

    const fileResponse: boolean = httpHeaders.hasOwnProperty("content-type");

    const webout = (await fileExists(weboutPath))
      ? fileResponse && !forceStringResult
        ? await readFileBinary(weboutPath)
        : await readFile(weboutPath)
      : "";

    return {
      httpHeaders,
      result:
        isDebugOn(vars) || session.crashed
          ? `${webout}\n${process.logsUUID}\n${log}`
          : webout,
    };
  }
}
