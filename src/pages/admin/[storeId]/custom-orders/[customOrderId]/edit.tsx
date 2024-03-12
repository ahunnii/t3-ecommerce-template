import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { CustomOrderForm } from "~/modules/custom-orders/admin/custom-order-form";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import AdminLayout from "~/components/layouts/admin-layout";

interface IProps {
  customOrderId: string;
}

const EditCustomOrderPage: FC<IProps> = ({ customOrderId }) => {
  const { data: billboard, isLoading } =
    api.customOrder.getCustomRequest.useQuery({
      customOrderId,
    });
  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}

      <div className="flex-1 space-y-4 p-8 pt-6">
        {!isLoading && billboard && <CustomOrderForm initialData={billboard} />}
        {!isLoading && !billboard && (
          <DataFetchErrorMessage message="There seems to be an issue with loading the billboard" />
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

export default EditCustomOrderPage;
