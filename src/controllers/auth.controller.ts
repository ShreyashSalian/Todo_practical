import express, { Request, Response } from "express";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";

import { Login } from "../models/login.model";
import { UserLoginDetails } from "../helper/user.helper";
import { asyncHandler } from "../utils/fuctionList";

const generateAccessAndRefreshToken = async (
  userId: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  return { accessToken, refreshToken };
};

//POST METHOD => ALLOW THE USER TO LOGIN
export const login = asyncHandler(
  async (
    req: Request<{}, {}, UserLoginDetails>,
    res: Response
  ): Promise<Response> => {
    const { emailOrUserName, password } = req.body;
    const userFound = await User.findOne({
      $or: [
        {
          email: { $regex: emailOrUserName, $options: "i" },
        },
        {
          userName: emailOrUserName,
        },
      ],
    });
    if (!userFound) {
      return res.status(404).json({
        status: 404,
        message: null,
        data: null,
        error:
          "Sorry, no user has found with the given email or contact Number.",
      });
    }
    if (userFound.isDeleted) {
      return res.status(403).json({
        status: 403,
        message: null,
        data: null,
        error: "Account is disabled. Please contact support.",
      });
    }
    const passwordCheck = await userFound.comparePassword(password);
    if (!passwordCheck) {
      return res.status(401).json({
        status: 401,
        message: null,
        data: null,
        error: "Please enter valid password.",
      });
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      userFound?._id
    );
    await Login.create({
      userId: userFound?._id,
      email: userFound?.email,
      token: accessToken,
      refreshToken: refreshToken,
    });
    const loginUser = await User.findById(userFound?._id).select(
      "-password -refreshToken"
    );
    // const options = {
    //   httpOnly: true,
    //   secure: true,
    // };

    return (
      res
        .status(200)
        // .cookie("accessToken", accessToken, options)
        // .cookie("refreshToken", refreshToken, options)
        .json({
          status: 200,
          message: "User has login successfully.",
          data: { accessToken, refreshToken, loginUser },
          error: null,
        })
    );
  }
);

//GET ALLOW THE USER TO LOGOUT
export const userLogout = asyncHandler(
  async (req: Request, res: Response): Promise<express.Response> => {
    console.log(req.user.userId);
    if (!req.user?.userId) {
      const responsePayload = {
        status: 200,
        message: null,
        data: null,
        error: "Invalid or missing user_id in request",
      };
      return res.status(200).json(responsePayload);
    }
    const deleteUserFromLogin = await Login.findOneAndDelete({
      userId: req.user?.userId,
    });
    if (!deleteUserFromLogin) {
      const responsePayload = {
        status: 200,
        message: null,
        data: null,
        error: "User cannot logout.",
      };
      return res.status(200).json(responsePayload);
    } else {
      // const cookieOptions = {
      //   httpOnly: true,
      //   secure: true, // Ensure secure cookies in production
      //   sameSite: "strict" as const, // Add `sameSite` for CSRF protection
      // };

      const responsePayload = {
        status: 200,
        message: "User logged out successfully.",
        data: null,
        error: null,
      };

      return (
        res
          .status(200)
          // .clearCookie("accessToken", cookieOptions)
          // .clearCookie("refreshToken", cookieOptions)
          .json(responsePayload)
      );
    }
  }
);
