import type { GetServerSidePropsContext } from "next";
import Link from "next/link";
import type { FC } from "react";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";

import { Button } from "~/components/ui/button";

import { Pencil } from "lucide-react";
import { AdminFormBody } from "~/components/common/admin/admin-form-body";
import { AdminFormHeader } from "~/components/common/admin/admin-form-header";
import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import AdminLayout from "~/components/layouts/admin-layout";
import { ViewCustomOrderImages } from "~/modules/custom-orders/components/admin/view-custom-order-images.admin";
import { ViewCustomOrder } from "~/modules/custom-orders/components/admin/view-custom-order.admin";

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

      {!isLoading && customOrder && (
        <>
          <AdminFormHeader
            title={
              customOrder.email + " - " + customOrder.createdAt.toDateString()
            }
            description={"View details about the custom order at a glance."}
            contentName="Custom Orders"
            link={`/admin/${customOrder.storeId}/custom-orders`}
          >
            <Link href={editBillboardURL}>
              <Button className="flex gap-2" size={"sm"}>
                <Pencil className="h-5 w-5" /> Edit...
              </Button>
            </Link>
          </AdminFormHeader>

          <AdminFormBody className="space-y-0">
            <ViewCustomOrder customOrder={customOrder} />
            <ViewCustomOrderImages images={customOrder.images} />
          </AdminFormBody>
        </>
      )}
      {!customOrder && !isLoading && (
        <DataFetchErrorMessage message="There seems to be an issue with loading the custom order" />
      )}
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
