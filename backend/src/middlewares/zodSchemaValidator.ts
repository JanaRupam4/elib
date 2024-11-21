import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";

// Generic Zod validation middleware
const validateWithZod = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body); // Validate the request body against the schema
      next(); // Proceed if validation succeeds
    } catch (error) {
      if (error instanceof ZodError) {
        // Send validation errors to the client and stop further processing
        res.status(400).json({
          message: "Validation failed",
          errors: error.errors,
        });
        return; // Ensure the function returns `void`
      }
      next(error); // If it's another type of error, pass it to the error handler
    }
  };
};

export default validateWithZod;
