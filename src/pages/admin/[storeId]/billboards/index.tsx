import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import AdminLayout from "~/components/layouts/admin-layout";

import { BillboardClient } from "~/modules/billboards/components/admin/client";
import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

type TProps = { storeId: string };

const BillboardsPage: FC<TProps> = ({ storeId }) => {
  const { data: billboards, isLoading } =
    api.billboards.getAllBillboards.useQuery(
      { storeId },
      {
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: false,
      }
    );

  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}
      {!isLoading && <BillboardClient data={billboards ?? []} />}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default BillboardsPage;
