import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";

import { CategoriesClient } from "~/modules/categories/admin/client";

import AdminLayout from "~/components/layouts/admin-layout";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";

interface IProps {
  storeId: string;
}
const CategoriesPage: FC<IProps> = ({ storeId }) => {
  const { data: categories, isLoading } = api.categories.getCategories.useQuery(
    { storeId, includeProducts: true }
  );

  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}
      {!isLoading && <CategoriesClient data={categories ?? []} />}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default CategoriesPage;
