import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";

import { OrderForm } from "~/components/admin/orders/order-form";
import PageLoader from "~/components/ui/page-loader";
import AdminLayout from "~/layouts/AdminLayout";

interface IProps {
  orderId: string;
}
const OrderPage: FC<IProps> = ({ orderId }) => {
  const { data: order } = api.orders.getOrder.useQuery({
    orderId,
  });

  return (
    <AdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {typeof order === "undefined" && <PageLoader />}
          {typeof order === "object" && (
            <OrderForm initialData={order ?? null} />
          )}
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
      orderId: ctx.query.orderId,
    },
  };
}

export default OrderPage;
