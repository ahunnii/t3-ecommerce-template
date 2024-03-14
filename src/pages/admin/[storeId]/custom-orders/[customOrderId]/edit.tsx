import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { CustomOrderForm } from "~/modules/custom-orders/components/admin/custom-order-form";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import AdminLayout from "~/components/layouts/admin-layout";

interface IProps {
  customOrderId: string;
}

const EditCustomOrderPage: FC<IProps> = ({ customOrderId }) => {
  const { data: customOrder, isLoading } =
    api.customOrder.getCustomRequest.useQuery({
      customOrderId,
    });
  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}

      {!isLoading && customOrder && (
        <CustomOrderForm initialData={customOrder} />
      )}
      {!isLoading && !customOrder && (
        <DataFetchErrorMessage message="There seems to be an issue with loading the custom order." />
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

export default EditCustomOrderPage;
