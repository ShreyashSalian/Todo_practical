import express, { Request, Response, NextFunction } from "express";
export const trimInput = (value: string) => {
  if (typeof value === "string") {
    return value.trim();
  }
  return value;
};

export function asyncHandler<
  P = {}, // Params type
  ResBody = any, // Response body type
  ReqBody = any, // Request body type
  ReqQuery = any // Request query type
>(
  fn: (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction
  ) => Promise<any>
) {
  return (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response,
    next: NextFunction
  ) => Promise.resolve(fn(req, res, next)).catch(next);
}
