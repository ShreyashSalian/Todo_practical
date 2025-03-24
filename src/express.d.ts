interface userDetails {
  userId: string;
  email: string;
  token: string;
}

import * as express from "express-serve-static-core";
declare global {
  namespace Express {
    interface Request {
      user?: userdetails;
    }
  }
}
