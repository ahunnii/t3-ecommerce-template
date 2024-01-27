import type { GetServerSidePropsContext } from "next";
import { useCallback, useEffect, useState, type FC } from "react";

import PageLoader from "~/components/ui/page-loader";
import { OrderClient } from "~/modules/orders/components/admin/client";
import type { OrderColumn } from "~/modules/orders/components/admin/columns";
import { ShippingModal } from "~/modules/shipping/components/shipping-modal";

import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";

import { Button } from "~/components/ui/button";
import { useShippingModal } from "~/hooks/admin/use-shipping-modal";
import AdminLayout from "~/layouts/AdminLayout";
import { formatOrderTableData } from "~/modules/orders/utils/format-order-table-data";
import type { DetailedOrder } from "~/types";

interface IProps {
  storeId: string;
}

const OrdersPage: FC<IProps> = ({ storeId }) => {
  const [formattedOrders, setFormattedOrders] = useState<OrderColumn[]>([]);
  const { data: orders } = api.orders.getAllOrders.useQuery({
    storeId,
  });
  const { data } = useShippingModal();
  const formatOrders = useCallback((orders: DetailedOrder[]) => {
    return orders.map((item: DetailedOrder) => formatOrderTableData(item));
  }, []);

  useEffect(() => {
    if (orders) setFormattedOrders(formatOrders(orders) as OrderColumn[]);
  }, [orders, formatOrders]);

  return (
    <AdminLayout>
      <h1>Blog Posts</h1>
      <Button></Button>
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
