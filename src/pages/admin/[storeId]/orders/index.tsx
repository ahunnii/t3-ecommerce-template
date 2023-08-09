import { format } from "date-fns";

import { prisma } from "~/server/db";
import { formatter } from "~/utils/styles";

import type { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import { OrderClient } from "~/components/admin/orders/client";
import type { OrderColumn } from "~/components/admin/orders/columns";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/utils/api";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const userId = session.user.id;

  const store = await prisma.store.findFirst({
    where: {
      id: ctx.query.storeId as string,
      userId,
    },
  });

  if (!store) {
    return {
      redirect: {
        destination: `/admin`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      params: ctx.query,
    },
  };
}

const OrdersPage = ({ params }: { params: { storeId: string } }) => {
  const [formattedOrders, setFormattedOrders] = useState<OrderColumn[]>([]);
  const { data: orders } = api.orders.getAllOrders.useQuery({
    storeId: params?.storeId,
  });

  useEffect(() => {
    if (orders) {
      setFormattedOrders(
        orders.map((item) => ({
          id: item.id,
          phone: item.phone,
          address: item.address,
          products: item.orderItems
            .map((orderItem) => orderItem.product.name)
            .join(", "),
          totalPrice: formatter.format(
            item.orderItems.reduce((total, item) => {
              return total + Number(item.product.price);
            }, 0)
          ),
          isPaid: item.isPaid,
          createdAt: format(item.createdAt, "MMMM do, yyyy"),
        }))
      );
    }
  }, [orders]);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
