import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  error.message = error.message || "Server error";
  error.statusCode = error.statusCode || 500;

  if (error.message === "jwt expired") {
    error.message = "Please login again.";
    error.statusCode = 401;
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
};