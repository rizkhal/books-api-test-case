import { RequestHandler, Request, Response, NextFunction } from "express";
import { validationResult, body } from "express-validator";

const store: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

export default [body("name").notEmpty().escape(), store];
