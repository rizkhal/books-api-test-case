import { Router, Request, Response } from "express";
import v1 from "./v1";

import errorHandler from "../middlewares/errorHandler";
import notFoundHandler from "../middlewares/notFoundHandler";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to Books API",
  });
});

router.use("/api/v1", v1);

router.use(errorHandler);
router.use(notFoundHandler);

export default router;
