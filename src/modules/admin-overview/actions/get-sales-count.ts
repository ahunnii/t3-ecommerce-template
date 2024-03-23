import { prisma } from "~/server/db";

export const getSalesCount = async (storeId: string) => {
  const salesCount = await prisma.order.count({
    where: {
      storeId,
      paymentStatus: "PAID",
    },
  });

  return salesCount;
};
