import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";

import { CollectionsClient } from "~/modules/collections/components/admin/client";

import AdminLayout from "~/components/layouts/admin-layout";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";

interface IProps {
  storeId: string;
}

const CollectionsAdminPage: FC<IProps> = ({ storeId }) => {
  const { data: collections, isLoading } =
    api.collections.getAllCollections.useQuery({
      storeId,
    });

  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}
      {!isLoading && <CollectionsClient data={collections ?? []} />}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}
export default CollectionsAdminPage;
