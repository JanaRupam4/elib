import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";

const globalErrorMiddleware = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorMessage = err.message || "something went wrong.";
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    errorMessage,
  });
};
export default globalErrorMiddleware;
