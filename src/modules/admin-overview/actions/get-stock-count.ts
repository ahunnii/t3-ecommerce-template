import { prisma } from "~/server/db";

export const getStockCount = async (storeId: string) => {
  const stockCount = await prisma.product.count({
    where: {
      storeId,
      status: "ACTIVE",
    },
  });

  return stockCount;
};
