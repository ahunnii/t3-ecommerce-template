import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";

import { ContentClient } from "~/modules/content/components/admin/content-client.admin";

import AdminLayout from "~/components/layouts/admin-layout";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import { BasicGraphQLPage } from "~/modules/content/types";

interface IProps {
  storeId: string;
}
const ContentPage: FC<IProps> = ({ storeId }) => {
  const { data, isLoading } = api.content.getPages.useQuery();

  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}
      {!isLoading && <ContentClient data={data ?? []} />}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default ContentPage;
