import { format } from "date-fns";
import { useCallback, useEffect, useState, type FC } from "react";

import type { Order, Product } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import type { OrderColumn } from "~/components/admin/orders/columns";

import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";
import { formatter } from "~/utils/styles";

import { OrderClient } from "~/components/admin/orders/client";
import PageLoader from "~/components/ui/page-loader";
import AdminLayout from "~/layouts/AdminLayout";

interface IProps {
  storeId: string;
}

interface ExtendedOrder extends Order {
  orderItems: Array<{
    product: Product;
  }>;
}

const OrdersPage: FC<IProps> = ({ storeId }) => {
  const [formattedOrders, setFormattedOrders] = useState<OrderColumn[]>([]);
  const { data: orders } = api.orders.getAllOrders.useQuery({
    storeId,
  });

  const formatOrders = useCallback((orders: ExtendedOrder[]) => {
    return orders.map((item: ExtendedOrder) => ({
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
    }));
  }, []);

  useEffect(() => {
    if (orders) setFormattedOrders(formatOrders(orders) as OrderColumn[]);
  }, [orders, formatOrders]);

  return (
    <AdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {!orders && <PageLoader />}
          {orders && <OrderClient data={formattedOrders} />}
        </div>
      </div>
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const store = await authenticateSession(ctx);

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
      storeId: ctx.query.storeId,
    },
  };
}

export default OrdersPage;
