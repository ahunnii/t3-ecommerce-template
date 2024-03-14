import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { api } from "~/utils/api";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import AdminLayout from "~/components/layouts/admin-layout";

import { OrderForm } from "~/modules/orders/components/admin/order-form";
import { authenticateAdminOrOwner } from "~/utils/auth";

interface IProps {
  orderId: string;
}
const OrderPage: FC<IProps> = ({ orderId }) => {
  const { data: order, isLoading } = api.orders.getOrder.useQuery({
    orderId,
  });

  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}
      {!isLoading && order && <OrderForm initialData={order} />}
      {!isLoading && !order && (
        <DataFetchErrorMessage message="There seems to be an issue with loading the order." />
      )}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx, (ctx) => {
    return {
      props: {
        orderId: ctx.query.orderId,
        storeId: ctx.query.storeId,
      },
    };
  });
}

export default OrderPage;
