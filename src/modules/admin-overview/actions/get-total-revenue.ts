import { prisma } from "~/server/db";

export const getTotalRevenue = async (storeId: string, lastMonth?: boolean) => {
  // let paidOrders;
  // if (lastMonth) {
  //   const today = new Date();
  //   // const firstDayOfCurrentMonth = new Date(
  //   //   today.getFullYear(),
  //   //   today.getMonth(),
  //   //   1
  //   // );
  //   const lastDayOfPreviousMonth = new Date(
  //     today.getFullYear(),
  //     today.getMonth(),
  //     0
  //   );

  //   paidOrders = await prisma.order.findMany({
  //     where: {
  //       storeId,
  //       paymentStatus: "PAID",
  //       createdAt: {
  //         // gte: firstDayOfCurrentMonth,
  //         lt: lastDayOfPreviousMonth,
  //       },
  //     },
  //     include: {
  //       fulfillments: true,
  //       orderItems: {
  //         include: {
  //           product: true,
  //         },
  //       },
  //     },
  //   });
  // } else {
  const paidOrders = await prisma.order.findMany({
    where: {
      storeId,
      paymentStatus: "PAID",
    },
    include: {
      fulfillments: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });
  // }

  const totalRevenue = paidOrders.reduce((total, order) => {
    const shippingLabelCost = order.fulfillments.reduce(
      (total, fulfillment) => {
        return total + (fulfillment?.cost ?? 0) * 100;
      },
      0
    );

    return (
      total +
      (order.total -
        order.tax -
        (order.discount ?? 0) -
        (shippingLabelCost ?? 0) -
        order.fee)
    );
  }, 0);

  return totalRevenue / 100;
};
