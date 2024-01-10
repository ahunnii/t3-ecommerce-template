import type { Order } from "@prisma/client";

export const filterOrdersByLastWeek = (orders: Order[]) => {
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  const filteredOrders = orders.filter((order: Order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate > lastWeek;
  });

  return filteredOrders;
};
