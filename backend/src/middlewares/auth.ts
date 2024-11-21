import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "./asyncHandler";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { Config } from "../config/config";
export interface AuthRequest extends Request {
  userId: string;
}
const authenticated = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.header("Authorization");
      if (!token) {
        return next(createHttpError(401, "Authorization token is required."));
      }
      try {
        const parsedToken = token.split(" ")[1];
        const decoded = verify(parsedToken, Config.JWT_SECRET as string);
        const _req = req as AuthRequest;
        _req.userId = decoded.sub as string;

        next();
      } catch (err) {
        return next(createHttpError(401, "Token expired."));
      }
    } catch (error) {
      return next(createHttpError(500, "failed to parse token."));
    }
  }
);
export default authenticated;
