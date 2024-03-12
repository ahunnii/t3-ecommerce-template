import type { GetServerSidePropsContext } from "next";
import { useMemo, type FC } from "react";

import { OrderClient } from "~/modules/orders/components/admin/client";
import type { OrderColumn } from "~/modules/orders/components/admin/columns";
import { ShippingModal } from "~/modules/shipping/components/shipping-modal";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import AdminLayout from "~/components/layouts/admin-layout";
import { formatOrderTableData } from "~/modules/orders/utils/format-order-table-data";
import { useShippingModal } from "~/modules/shipping/hooks/use-shipping-modal";
import type { DetailedOrder } from "~/types";

interface IProps {
  storeId: string;
}

const OrdersPage: FC<IProps> = ({ storeId }) => {
  const { data: orders, isLoading } = api.orders.getAllOrders.useQuery({
    storeId,
  });
  const { data } = useShippingModal();

  const orderData: OrderColumn[] = useMemo(() => {
    if (!orders) return [];
    return orders?.map((order: DetailedOrder) => formatOrderTableData(order));
  }, [orders]);

  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}

      {orders && <ShippingModal data={data ?? ""} />}
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <OrderClient data={orderData ?? []} />
        </div>
      </div>
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default OrdersPage;
