import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import AdminLayout from "~/components/layouts/admin-layout";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { CustomOrderClient } from "~/modules/custom-orders/components/admin/client";

type TProps = { storeId: string };

const CustomOrdersPage: FC<TProps> = ({ storeId }) => {
  const { data: billboards, isLoading } =
    api.customOrder.getCustomRequests.useQuery({
      storeId,
    });

  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}
      {!isLoading && <CustomOrderClient data={billboards ?? []} />}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default CustomOrdersPage;
