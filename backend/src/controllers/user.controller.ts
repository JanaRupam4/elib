import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import createHttpError from "http-errors";
import { IUser } from "../types/user.types";
import { User } from "../models/user.model";
import ApiResponse from "../utils/ApiResponse";
interface registerBody {
  name: string;
  email: string;
  password: string;
}
//signup controller
export const registerController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body as registerBody;
      if ([name, email, password].some((field) => field.trim() === "")) {
        return next(createHttpError(400, "All fields are required."));
      }
      try {
        const isExistingUser = await User.findOne({ email }).select(
          "+password"
        );
        if (isExistingUser) {
          return next(createHttpError(400, "User already exits."));
        }
      } catch (error) {
        return next(createHttpError(500, "Failed to find the user."));
      }
      try {
        const newUser: IUser = await User.create({
          name,
          email,
          password,
        });
        const token = newUser.generateAccessToken(newUser._id as string);
        res.status(201).json(new ApiResponse(201, "User created", token));
      } catch (error) {
        return next(createHttpError(500, "failed to create new user."));
      }
    } catch (error) {
      return next(createHttpError(500, "Failed to register new user."));
    }
  }
);
interface loginBody {
  email: string;
  password: string;
}
//login controller
export const loginController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as loginBody;
      try {
        const findUser = await User.findOne({ email });
        if (!findUser) {
          return next(createHttpError(400, "User not found."));
        }
        const matchPassword = await findUser.comparePassword(password);
        if (!matchPassword) {
          return next(createHttpError(400, "Invailed creadiential."));
        }
        const token = findUser.generateAccessToken(findUser._id as string);
        res.status(200).json(new ApiResponse(200, "Login successfull", token));
      } catch (error) {
        return next(createHttpError(500, "Unable to find the user."));
      }
    } catch (error) {
      return next(createHttpError(500, "Failed to login the user."));
    }
  }
);
