import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";

import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";
import AdminLayout from "~/components/layouts/admin-layout";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import { BillboardClient } from "~/modules/billboards/admin/client";

type TProps = { storeId: string };

const BillboardsPage: FC<TProps> = ({ storeId }) => {
  const { data: billboards, isLoading } =
    api.billboards.getAllBillboards.useQuery({
      storeId,
    });

  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}
      {!isLoading && (
        <div className="flex h-full flex-col">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <BillboardClient data={billboards ?? []} />
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { store, user, redirect } = await authenticateAdminOrOwner(ctx);

  if (!store || !user) return { redirect };

  return {
    props: {
      storeId: ctx.query.storeId,
    },
  };
}

export default BillboardsPage;
