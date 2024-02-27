import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";

import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";
import AdminLayout from "~/components/layouts/admin-layout";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { CustomOrderClient } from "~/modules/custom-orders/admin/client";

type TProps = { storeId: string };

const CustomOrdersPage: FC<TProps> = ({ storeId }) => {
  const { data: billboards, isLoading } =
    api.customOrder.getCustomRequests.useQuery({
      storeId,
    });

  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}
      {!isLoading && (
        <div className="flex h-full flex-col">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <CustomOrderClient data={billboards ?? []} />
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default CustomOrdersPage;
