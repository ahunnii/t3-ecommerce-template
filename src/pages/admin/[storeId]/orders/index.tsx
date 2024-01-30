import type { GetServerSidePropsContext } from "next";
import { useCallback, useEffect, useState, type FC } from "react";

import PageLoader from "~/components/ui/page-loader";
import { OrderClient } from "~/modules/orders/components/admin/client";
import type { OrderColumn } from "~/modules/orders/components/admin/columns";
import { ShippingModal } from "~/modules/shipping/components/shipping-modal";

import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";
import AdminLayout from "~/components/layouts/admin-layout";
import { useShippingModal } from "~/hooks/admin/use-shipping-modal";
import { formatOrderTableData } from "~/modules/orders/utils/format-order-table-data";
import type { DetailedOrder } from "~/types";

interface IProps {
  storeId: string;
}

const OrdersPage: FC<IProps> = ({ storeId }) => {
  const { data: orders, isLoading } = api.orders.getAllOrders.useQuery({
    storeId,
  });
  const { data } = useShippingModal();

  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}

      {orders && <ShippingModal data={data ?? ""} />}
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <OrderClient data={orders ?? []} />
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
