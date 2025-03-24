import { User } from "../models/user.model";
import express, { Request, Response } from "express";
import { asyncHandler } from "../utils/fuctionList";
export const addUser = asyncHandler(
  async (req: Request, res: Response): Promise<express.Response> => {
    const {
      fullName,
      userName,
      password,
      email,
      contactNumber,
    }: {
      fullName: string;
      userName: string;
      password: string;
      email: string;
      contactNumber: string;
    } = req.body;

    const userExist = await User.findOne({
      $or: [
        {
          email: email,
        },
        {
          userName: userName,
        },
      ],
    });
    if (userExist) {
      return res.status(409).json({
        status: 409,
        message: null,
        error: "User already exists with the given user name and email",
        data: null,
      });
    }
    const userCreation = await User.create({
      fullName,
      email,
      password,
      userName,
      contactNumber,
      role: "user",
    });

    if (!userCreation) {
      return res.status(500).json({
        status: 500,
        message: null,
        error: "Sorry, the user can not added due to some reason.",
      });
    } else {
      return res.status(201).json({
        status: 201,
        message: "User created successfully.",
        data: null,
        error: null,
      });
    }
  }
);
