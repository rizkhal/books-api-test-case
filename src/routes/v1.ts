import { Router } from "express";

// member
import memberController from "../controllers/member.controller";

// book
import bookController from "../controllers/book.controller";
import { borrowBookValidator, returnBookValidator } from "../validators/borrow.validator";

const router: Router = Router();

// member
router.get("/members", memberController.index);

// book
router.get("/books", bookController.index);
router.post("/books/borrow", borrowBookValidator(), bookController.borrow);
router.post("/books/return", returnBookValidator(), bookController.return);

export default router;
