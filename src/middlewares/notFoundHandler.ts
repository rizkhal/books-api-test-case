import { Request, Response, NextFunction } from "express";

export default function notFound(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(404).json({
    message: "Error",
    stack: `🔍 - Not Found - ${req.originalUrl}`,
  });
}
