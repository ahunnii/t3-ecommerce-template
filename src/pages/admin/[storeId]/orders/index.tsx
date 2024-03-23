import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";

import { OrderClient } from "~/modules/orders/components/admin/client";

import { ShippingModal } from "~/modules/shipping/components/shipping-modal";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import AdminLayout from "~/components/layouts/admin-layout";

import { useShippingModal } from "~/modules/shipping/hooks/use-shipping-modal";

interface IProps {
  storeId: string;
}

const OrdersPage: FC<IProps> = ({ storeId }) => {
  const { data: orders, isLoading } = api.orders.getAllPaidOrders.useQuery({
    storeId,
  });
  const { data } = useShippingModal();

  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}
      {orders && <ShippingModal data={data ?? ""} />}
      {!isLoading && <OrderClient data={orders ?? []} />}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default OrdersPage;
