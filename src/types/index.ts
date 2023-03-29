import { CustomValidator } from "express-validator";

export type BorrowedBookRequest = {
  memberId: number;
  borrowedBookId: number;
};

export type CustomValidatorRequest = CustomValidator & number;
