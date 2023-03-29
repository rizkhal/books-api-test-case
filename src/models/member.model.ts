import prisma from "../database/client";
import { Member } from "@prisma/client";

export const findById = async (id: number | string): Promise<Member | null> => {
  return await prisma.member.findFirst({
    where: {
      id: Number(id),
    },
  });
};
