import { NextFunction, Request, Response } from "express";

export const asyncHandler = (anyFn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(anyFn(req, res, next)).catch((err) => next(err));
  };
};
