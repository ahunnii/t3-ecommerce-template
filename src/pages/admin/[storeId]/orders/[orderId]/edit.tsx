import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { api } from "~/utils/api";

import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";
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
      {!isLoading && (
        <div className="flex-1 space-y-4 p-8 pt-6">
          {order && <OrderForm initialData={order} />}
          {!order && (
            <DataFetchErrorMessage message="There seems to be an issue with loading the order." />
          )}
        </div>
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
