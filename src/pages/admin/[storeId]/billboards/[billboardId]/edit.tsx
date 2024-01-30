import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { BillboardForm } from "~/modules/billboards/admin/billboard-form";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";
import AdminLayout from "~/components/layouts/admin-layout";

interface IProps {
  billboardId: string;
}

const EditBillboardPage: FC<IProps> = ({ billboardId }) => {
  const { data: billboard, isLoading } = api.billboards.getBillboard.useQuery({
    billboardId: billboardId,
  });
  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}

      <div className="flex-1 space-y-4 p-8 pt-6">
        {!isLoading && billboard && <BillboardForm initialData={billboard} />}
        {!isLoading && !billboard && (
          <DataFetchErrorMessage message="There seems to be an issue with loading the billboard" />
        )}
      </div>
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { store, user, redirect } = await authenticateAdminOrOwner(ctx);

  if (!store || !user) return { redirect };

  return {
    props: {
      billboardId: ctx.query.billboardId,
    },
  };
}

export default EditBillboardPage;
