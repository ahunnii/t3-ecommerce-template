import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { BillboardForm } from "~/modules/billboards/components/admin/billboard-form";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
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
      {!isLoading && billboard && <BillboardForm initialData={billboard} />}
      {!isLoading && !billboard && (
        <DataFetchErrorMessage message="There seems to be an issue with loading the billboard" />
      )}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx, (ctx) => {
    return {
      props: {
        billboardId: ctx.query.billboardId,
      },
    };
  });
}
export default EditBillboardPage;
