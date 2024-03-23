import { prisma } from "~/server/db";

export const getUserOrdersServerSide = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: { userId, paymentStatus: "PAID" },
  });

  const formattedOrders = orders.map((order) => {
    return {
      ...order,
      createdAt: order.createdAt.toDateString(),
      updatedAt: order.updatedAt.toDateString(),
    };
  });

  return formattedOrders;
};
