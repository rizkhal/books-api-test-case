import prisma from "../database/client";
import { StatusEnum } from "../utils/enum";
import { BorrowedBook } from "@prisma/client";

export const findBorrowedBook = async (borrowedBookId: number, memberId: number): Promise<BorrowedBook | null> => {
  return prisma.borrowedBook.findFirst({
    where: {
      id: borrowedBookId,
      AND: {
        memberId: memberId,
        status: StatusEnum.ACTIVE,
      },
    },
  });
};
