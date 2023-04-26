import express from "express";
import { Get, Post, Request } from "tsoa";
import responsesJson from "../../sasviya/responses.json";
import { loginForm } from "../../sasviya/login-form";
import { getFilePath } from "../utils";
import { ExecutionController } from "./internal";

export interface SasViyaResponse {
  //EXECUTE SERVICE
  content: any;
  type?: "text" | "json";
  redirect?: string;
  status?: number;
  error?: boolean;
}

export class SasViyaController {
  private loggedInUser: string | undefined;
  private jobsWaitCounter = 1;
  private authorizedEndpoints: string[] = [];

  // contains service execution results to be returned when requested trough /files/files API
  public executionResults: string[] = [];

  @Get("/SASLogon/login")
  public async getLogin(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    const acceptJson = req.headers.accept === "application/json";

    const jsonResponse = responsesJson["/SASLogon/login"];
    const formResponse = loginForm;

    if (acceptJson) {
      return {
        content: jsonResponse,
      };
    }

    return {
      content: formResponse,
      type: "text",
    };
  }

  @Post("/SASLogon/login.do")
  public async login(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    this.loggedInUser = req.body.username;

    return {
      content: "",
      redirect: "/../",
    };
  }

  @Get("/SASLogon/logout.do")
  public async logout(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    return {
      content: "/SASLogon/login",
    };
  }

  @Get("/SASLogon/oauth/authorize")
  public async oauthAuthorize(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    const redirect_uri = req.query.redirect_uri;
    const code = req.query.code;
    const state = req.query.state;

    let redirect = `${redirect_uri}?state=${state}`;

    if (!this.loggedInUser) redirect = "/SASLogon/login";

    return {
      content: "",
      redirect: redirect,
    };
  }

  @Get("/SASDrive")
  public async getSasDrive(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    const code = req.query.code;

    if (code) {
      return {
        content: "",
        redirect: "/SASDrive",
      };
    }

    return {
      content: "SAS Drive",
    };
  }

  @Get("/identities")
  public async getIdentities(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    const redirectToSub = req.query.state;
    const redirect = `${redirectToSub}?state=auth`;

    return {
      content: "",
      redirect: redirect,
    };
  }

  @Get("/identities/users/@currentUser")
  public async getCrrentUser(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    const state = req.query.state;
    const urlWithoutQuery = req.originalUrl.split("?")[0];

    if (state !== "auth") {
      const redirect = `/SASLogon/oauth/authorize?client_id=sas.identities&redirect_uri=/identities/&response_type=code&state=${urlWithoutQuery}`;

      return {
        content: "",
        redirect: redirect,
      };
    }

    const jsonResponse = responsesJson["/identities/users/@currentUser"];

    return {
      content: jsonResponse,
    };
  }

  @Post("/SASJobExecution")
  public async postSasJobExecution(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    return {
      content: "test",
    };
  }

  @Get("/folders")
  public async getFolders(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    const redirectToSub = req.query.state;
    const redirect = `${redirectToSub}?state=auth`;

    return {
      content: "",
      redirect: redirect,
    };
  }

  @Get("/folders/folders/@item")
  public async getFoldersByItem(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    const state = req.query.state;
    const urlWithoutQuery = req.originalUrl.split("?")[0];

    if (state !== "auth") {
      const redirect = `/SASLogon/oauth/authorize?client_id=sas.files&redirect_uri=/folders/&response_type=code&state=${urlWithoutQuery}`;
      return {
        content: "",
        redirect: redirect,
      };
    }

    const jsonResponse = responsesJson["folders/folders/@item"];

    return {
      content: jsonResponse,
    };
  }

  @Get("/folders/folders/:id/members")
  public async getFolderMembers(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    const state = req.query.state;
    const urlWithoutQuery = req.originalUrl.split("?")[0];

    if (state !== "auth") {
      const redirect = `/SASLogon/oauth/authorize?client_id=sas.files&redirect_uri=/folders/&response_type=code&state=${urlWithoutQuery}`;
      return {
        content: "",
        redirect: redirect,
      };
    }

    // In the response we include all jobs
    // but in real scenario, adapter sends another request to re-populate members again
    // That bit should be considered in future
    const jsonResponse = responsesJson["/folders/folders/:id/members"];

    return {
      content: jsonResponse,
    };
  }

  @Get("/files")
  public async getFiles(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    const redirectToSub = req.query.state;
    const redirect = `${redirectToSub}?state=auth`;

    return {
      content: "",
      redirect: redirect,
    };
  }

  @Post("/files/files")
  public async postFile(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    const jsonResponse = responsesJson["/files/files"];

    return {
      content: jsonResponse,
    };
  }

  @Get("/files/files/:id/content")
  public async getFileContent(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    const state = req.query.state;
    const urlWithoutQuery = req.originalUrl.split("?")[0];

    if (state !== "auth") {
      const redirect = `/SASLogon/oauth/authorize?client_id=sas.files&redirect_uri=/files/&response_type=code&state=${urlWithoutQuery}`;
      return {
        content: "",
        redirect: redirect,
      };
    }

    const executedServiceResponse =
      this.executionResults.shift() || "No webout returned";
    let jsonResponse = {};

    try {
      jsonResponse = JSON.parse(executedServiceResponse);
    } catch (err) {
      return {
        content: err,
        error: true,
      };
    }

    return {
      content: jsonResponse,
    };
  }

  @Get("/jobDefinitions")
  public async getJobDefinitions(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    const redirectToSub = req.query.state;
    const redirect = `${redirectToSub}?state=auth`;

    return {
      content: "",
      redirect: redirect,
    };
  }

  @Get("/jobDefinitions/definitions/:id")
  public async getJobDefinitionDetails(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    const state = req.query.state;
    const urlWithoutQuery = req.originalUrl.split("?")[0];

    if (state !== "auth") {
      const redirect = `/SASLogon/oauth/authorize?client_id=sas.jobExecution&redirect_uri=/jobDefinitions/&response_type=code&state=${urlWithoutQuery}`;
      return {
        content: "",
        redirect: redirect,
      };
    }

    const jsonResponse = responsesJson["/jobDefinitions/definitions/:id"];

    return {
      content: jsonResponse,
    };
  }

  @Post("/jobExecution/jobs")
  public async submitJob(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    const body = req.body;
    const program = body.arguments._program;

    console.log("program", program);

    const vars = { ...body.arguments };
    const otherArgs = {};

    try {
      const codePath = await getFilePath(program + ".js");

      // todo: set session from req.sasjsSession
      const result = await new ExecutionController().executeFile({
        programPath: codePath,
        vars: vars,
        otherArgs: otherArgs,
        session: req.sasjsSession,
        forceStringResult: true,
      });

      const resultString = result.result as string;
      this.executionResults.push(resultString);

      process.logger.info(`Execution of (${program}) successfull`);
    } catch (err) {
      process.logger.error("err", err);
    }

    const jsonResponse = responsesJson["/jobExecution/jobs"];

    return {
      content: jsonResponse,
    };
  }

  @Get("/jobExecution/jobs/:id")
  public async getJob(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    const jsonResponse = responsesJson["/jobExecution/jobs/:id"];

    return {
      content: jsonResponse,
    };
  }

  @Get("/jobExecution/jobs/:id/state")
  public async getJobState(
    @Request() req: express.Request
  ): Promise<SasViyaResponse> {
    // We will keep it as a reference if needed later
    // const wait = req.query.wait ? parseInt((req.query.wait).toString()) : 100

    if (this.jobsWaitCounter > 10) {
      this.jobsWaitCounter = 1;

      return {
        content: "completed",
      };
    } else {
      this.jobsWaitCounter++;

      return {
        content: "running",
      };
    }
  }
}
