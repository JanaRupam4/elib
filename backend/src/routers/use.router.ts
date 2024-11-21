import { Router } from "express";
import validateWithZod from "../middlewares/zodSchemaValidator";
import {
  loginController,
  registerController,
} from "../controllers/user.controller";
import {
  userLoginZodSchema,
  userRegisterZodSchema,
} from "../validation/user.validation";

export const userRouter = Router();

userRouter
  .route("/register")
  .post(validateWithZod(userRegisterZodSchema), registerController);
userRouter
  .route("/login")
  .post(validateWithZod(userLoginZodSchema), loginController);
