import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";
import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { ShippingModal } from "~/modules/shipping/components/shipping-modal";

import AdminLayout from "~/components/layouts/admin-layout";

import { Pencil } from "lucide-react";
import Link from "next/link";
import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import { AdminFormBody } from "~/components/common/admin/admin-form-body";
import { AdminFormHeader } from "~/components/common/admin/admin-form-header";

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

        {!isLoading && order && (
          <>
            <AdminFormHeader
              title={`Order for ${
                order?.name
              } on ${order?.createdAt.toDateString()}`}
              description={"View details on this order at a glance"}
              contentName="Orders"
              link={`/admin/${storeId}/orders`}
            >
              <Link href={`/admin/${storeId}/orders/${order?.id}/edit`}>
                <Button className="flex gap-2">
                  <Pencil className="h-5 w-5" />
                  Edit...
                </Button>
              </Link>
            </AdminFormHeader>

            <AdminFormBody className="mx-auto flex w-full max-w-7xl gap-4 max-lg:flex-col">
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
            </AdminFormBody>
          </>
        )}
        {!isLoading && !order && (
          <DataFetchErrorMessage message="There seems to be an issue with loading the order." />
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
