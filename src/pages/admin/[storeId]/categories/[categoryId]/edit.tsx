import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { CategoryForm } from "~/modules/categories/admin/category-form";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";
import AdminLayout from "~/components/layouts/admin-layout";

interface IProps {
  categoryId: string;
  storeId: string;
}
const EditCategoryPage: FC<IProps> = ({ categoryId, storeId }) => {
  const { data: category, isLoading: isCategoryLoading } =
    api.categories.getCategory.useQuery({
      categoryId,
    });

  const { data: billboards, isLoading: areBillboardsLoading } =
    api.billboards.getAllBillboards.useQuery({
      storeId,
    });

  return (
    <AdminLayout>
      {(isCategoryLoading || areBillboardsLoading) && <AbsolutePageLoader />}

      {!isCategoryLoading && !areBillboardsLoading && (
        <div className="flex-1 space-y-4 p-8 pt-6">
          {category && billboards && (
            <CategoryForm initialData={category} billboards={billboards} />
          )}

          {!category && (
            <DataFetchErrorMessage message="There seems to be an issue with loading the category." />
          )}

          {!billboards && (
            <DataFetchErrorMessage message="There seems to be an issue with loading the billboards." />
          )}
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
      categoryId: ctx.query.categoryId,
      storeId: ctx.query.storeId,
    },
  };
}

export default EditCategoryPage;
