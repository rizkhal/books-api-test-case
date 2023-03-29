import prisma from "../database/client";
import { format, isPast } from "date-fns";
import { StatusEnum } from "../utils/enum";
import { BorrowedBook } from "@prisma/client";
import { findBorrowedBook } from "../models/book.model";
import { validationResult, body } from "express-validator";
import { Request as ValidatorRequest } from "express-validator/src/base";
import { RequestHandler, Request, Response, NextFunction } from "express";
import type { BorrowedBookRequest, CustomValidatorRequest } from "../types";

const validator: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

const isNotBorrowed = async (req: ValidatorRequest) => {
  const { bookId } = req.body;

  const borrowedBook = await prisma.borrowedBook.findFirst({
    include: {
      book: true,
    },
    where: {
      bookId,
      AND: {
        status: StatusEnum.ACTIVE,
      },
    },
  });

  if (!borrowedBook) {
    return true;
  }

  throw new Error(`Book ${borrowedBook.book.title} already borrowed.`);
};

const isNotPenalized = async (value: CustomValidatorRequest, req: ValidatorRequest) => {
  const memberPenalized = await prisma.memberPenalty.findFirst({
    where: {
      memberId: value,
    },
  });

  if (!memberPenalized || (memberPenalized && isPast(memberPenalized.endAt))) {
    return true;
  }

  throw new Error(`Member has penalized, can't borrow any book until ${format(memberPenalized.endAt, "dd-MM-yyyy")}.`);
};

const isBorrowed = async (req: ValidatorRequest) => {
  const { memberId, borrowedBookId }: BorrowedBookRequest = req.body;
  const isHasBorrowed: BorrowedBook | null = await findBorrowedBook(borrowedBookId, memberId);

  if (isHasBorrowed) {
    return true;
  }

  throw new Error(`The borrowed book is not exists`);
};

export const returnBookValidator = () => {
  return [
    body("borrowedBookId")
      .notEmpty()
      .isInt()
      .custom(async (value: CustomValidatorRequest, { req }: ValidatorRequest) => {
        return isBorrowed(req);
      }),
    body("memberId").notEmpty().isInt(),
    validator,
  ];
};

export const borrowBookValidator = () => {
  return [
    body("bookId")
      .notEmpty()
      .isInt()
      .custom(async (value: CustomValidatorRequest, { req }: ValidatorRequest) => {
        return isNotBorrowed(req);
      }),
    body("memberId")
      .notEmpty()
      .isInt()
      .custom(async (value: CustomValidatorRequest, { req }: ValidatorRequest) => {
        return isNotPenalized(value, req);
      }),
    body("qty")
      .notEmpty()
      .isInt()
      .custom(async (value: CustomValidatorRequest) => {
        if (value > 1) {
          throw new Error(`Can't borrow greater than 1.`);
        }
      }),
    validator,
  ];
};
