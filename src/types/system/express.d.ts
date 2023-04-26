declare namespace Express {
  export interface Request {
    sasjsSession?: import("../").Session;
  }
}
