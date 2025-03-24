import express, { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Login } from "../models/login.model";
import dotenv from "dotenv";
import { asyncHandler } from "../utils/fuctionList";
dotenv.config();

//Used to check the token of the user=====

export const verifyUser = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      // Extract token from cookies or Authorization header
      const token: string | undefined =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "").trim();
      console.log(token);
      if (!token) {
        return res.status(401).json({
          status: 401,
          message: null,
          data: null,
          error: "Unauthorized request. No token provided.",
        });
      }

      const secretKey = process.env.ACCESS_TOKEN;
      if (!secretKey) {
        throw new Error("ACCESS_TOKEN environment variable is not set");
      }

      // Decode the token
      const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
      console.log("Decoded Token:", decodedToken);

      // Validate user details
      const userDetails = await Login.findOne({
        token,
        email: decodedToken.email,
        userId: decodedToken.userId,
      });

      if (!userDetails) {
        return res.status(401).json({
          status: 401,
          message: null,
          data: null,
          error: "Unauthorized request. Invalid token.",
        });
      }

      // Store user details in request
      req.user = userDetails;
      next();
    } catch (err: any) {
      console.error("Error verifying token:", err.message);

      if (["TokenExpiredError", "JsonWebTokenError"].includes(err.name)) {
        return res.status(401).json({
          status: 401,
          message: null,
          data: null,
          error: `Unauthorized request. ${err.message}`,
        });
      }

      return res.status(500).json({
        status: 500,
        message: "Internal server error.",
        data: null,
        error: "An error occurred during token verification.",
      });
    }
  }
);
