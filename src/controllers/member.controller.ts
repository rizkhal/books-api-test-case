import { Request, Response } from "express";
import prisma from "../database/client";

export default {
  async index(req: Request, res: Response) {
    try {
      const query = await prisma.member.findMany({
        include: {
          BorrowedBook: true,
        },
      });

      res.status(200).json({
        data: query,
      });
    } catch (error) {
      return res.status(400).json({
        message: "Bad Request",
      });
    }
  },
};
