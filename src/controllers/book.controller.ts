import { Request, Response } from "express";
import { BorrowedBook } from "@prisma/client";
import { addDays, isPast } from "date-fns";
import { findBorrowedBook } from "../models/book.model";
import { StatusEnum } from "../utils/enum";
import prisma from "../database/client";
import type { BorrowedBookRequest } from "../types";

export default {
  async index(req: Request, res: Response) {
    const { borrowed } = req.query;

    try {
      const filters = {};

      if (!borrowed) {
        Object.assign(filters, {
          BorrowedBook: {
            none: {},
          },
        });
      }

      const query = await prisma.book.findMany({
        where: filters,
      });

      res.status(200).json({
        data: query,
      });
    } catch (error) {
      return res.status(400).json({
        message: "Bad Request",
        error: error,
      });
    }
  },

  async borrow(req: Request, res: Response) {
    const { bookId, memberId, qty } = req.body;

    const startAt = new Date();
    const endAt = addDays(startAt, 7);

    try {
      const borrowBook = prisma.borrowedBook.create({
        data: {
          memberId: Number(memberId),
          bookId: Number(bookId),
          qty: Number(qty),
          startAt: startAt,
          endAt: endAt,
        },
      });

      const currentBook = await prisma.book.findFirst({ where: { id: bookId } });
      const currentMember = await prisma.member.findFirst({ where: { id: memberId } });

      const decreaseBookStock = prisma.book.update({
        where: { id: Number(bookId) },
        data: {
          stock: Number(currentBook?.stock) - Number(qty),
        },
      });

      await prisma.$transaction([borrowBook, decreaseBookStock]);

      return res.status(200).json({
        message: "Book borrowed",
        data: {
          book: currentBook,
          member: currentMember,
        },
      });
    } catch (error) {
      return res.status(400).json({
        message: "Bad Request",
        error: error,
      });
    }
  },

  async return(req: Request, res: Response) {
    try {
      const { borrowedBookId, memberId }: BorrowedBookRequest = req.body;

      const borrowedBook: BorrowedBook | null = await findBorrowedBook(borrowedBookId, memberId);

      if (!borrowedBook) {
        return res.status(400).json({
          message: "Bad Request",
        });
      }

      await prisma.$transaction(async (prisma) => {
        if (isPast(new Date(borrowedBook.endAt))) {
          const startAt = new Date();
          const endAt = addDays(startAt, 3);

          await prisma.memberPenalty.create({
            data: {
              memberId: borrowedBook.memberId,
              startAt: startAt,
              endAt: endAt,
            },
          });
        }

        await prisma.borrowedBook.updateMany({
          where: {
            id: borrowedBookId,
            AND: {
              memberId: memberId,
              status: StatusEnum.ACTIVE,
            },
          },
          data: { status: StatusEnum.COMPLETE },
        });

        await prisma.book.update({
          where: { id: borrowedBook.bookId },
          data: { stock: borrowedBook.qty },
        });

        return borrowedBook;
      });

      return res.status(200).json({
        message: "Book returned",
      });
    } catch (error) {
      return res.status(400).json({
        message: "Bad Request",
        error: error,
      });
    }
  },
};
