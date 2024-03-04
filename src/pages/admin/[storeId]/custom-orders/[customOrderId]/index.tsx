import type { GetServerSidePropsContext } from "next";
import Link from "next/link";
import type { FC } from "react";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { BackToButton } from "~/components/common/buttons/back-to-button";
import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";

import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";

import { Pencil } from "lucide-react";
import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import AdminLayout from "~/components/layouts/admin-layout";
import { ViewCustomOrderImages } from "~/modules/custom-orders/admin/view-custom-order-images.admin";
import { ViewCustomOrder } from "~/modules/custom-orders/admin/view-custom-order.admin";

interface IProps {
  customOrderId: string;
}

const CustomOrderPage: FC<IProps> = ({ customOrderId }) => {
  const { data: customOrder, isLoading } =
    api.customOrder.getCustomRequest.useQuery({
      customOrderId,
    });

  const editBillboardURL = `/admin/${customOrder?.storeId}/custom-orders/${customOrder?.id}/edit`;
  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}

      <div className="flex-1 space-y-4 p-8 pt-6">
        {!isLoading && customOrder && (
          <>
            <BackToButton
              link={`/admin/${customOrder.storeId}/custom-orders`}
              title="Back to Custom Orders"
            />
            <div className="flex w-full items-center justify-between">
              <Heading
                title={customOrder.email}
                description={customOrder.createdAt.toDateString()}
              />
              <Link href={editBillboardURL}>
                <Button className="flex gap-2" size={"sm"}>
                  <Pencil className="h-5 w-5" /> Edit Custom Order
                </Button>
              </Link>
            </div>
            {customOrder && (
              <div className="flex gap-2 ">
                <ViewCustomOrder customOrder={customOrder} />
                <ViewCustomOrderImages images={customOrder.images} />
              </div>
            )}
          </>
        )}
        {!customOrder && !isLoading && (
          <DataFetchErrorMessage message="There seems to be an issue with loading the custom order" />
        )}
      </div>
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx, (ctx) => {
    return {
      props: {
        customOrderId: ctx.query.customOrderId,
      },
    };
  });
}

export default CustomOrderPage;
