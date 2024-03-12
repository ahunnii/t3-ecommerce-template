import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";
import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { Heading } from "~/components/ui/heading";

import { ShippingModal } from "~/modules/shipping/components/shipping-modal";

import AdminLayout from "~/components/layouts/admin-layout";

import { Pencil } from "lucide-react";
import Link from "next/link";
import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import { BackToButton } from "~/components/common/buttons/back-to-button";
import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import { Button } from "~/components/ui/button";
import {
  ViewOrderCustomer,
  ViewOrderDetails,
  ViewOrderFulfillment,
  ViewOrderPayment,
  ViewOrderSummary,
  ViewOrderTimeline,
} from "~/modules/orders";

interface IProps {
  orderId: string;
  storeId: string;
}
const OrderPage: FC<IProps> = ({ orderId, storeId }) => {
  const { data: order, isLoading } = api.orders.getOrder.useQuery({
    orderId,
  });

  return (
    <>
      <AdminLayout>
        {order && <ShippingModal data={order.id} />}
        {isLoading && <AbsolutePageLoader />}

        {!isLoading && (
          <div className="flex-1 space-y-4 p-8 pt-6">
            {order && (
              <>
                <BackToButton
                  link={`/admin/${storeId}/orders`}
                  title="Back to Orders"
                />
                <div className="flex items-center justify-between">
                  <Heading
                    title={`Order for ${
                      order?.name
                    } on ${order?.createdAt.toDateString()}`}
                    description={order?.id}
                  />
                  <Link href={`/admin/${storeId}/orders/${order?.id}/edit`}>
                    <Button className="flex gap-2">
                      {" "}
                      <Pencil className="h-5 w-5" />
                      Edit...
                    </Button>
                  </Link>
                </div>

                <section className="flex w-full gap-4 max-lg:flex-col">
                  <div className="flex w-full flex-col space-y-4 lg:w-8/12">
                    <ViewOrderDetails {...order} />
                    <ViewOrderSummary {...order} />
                    <ViewOrderPayment {...order} />
                    <ViewOrderFulfillment {...order} />{" "}
                    <ViewOrderCustomer {...order} />
                  </div>
                  <div className="flex w-full flex-col lg:w-4/12">
                    <ViewOrderTimeline {...order} />
                  </div>
                </section>
              </>
            )}
            {!order && (
              <DataFetchErrorMessage message="There seems to be an issue with loading the order." />
            )}
          </div>
        )}
      </AdminLayout>
    </>
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
