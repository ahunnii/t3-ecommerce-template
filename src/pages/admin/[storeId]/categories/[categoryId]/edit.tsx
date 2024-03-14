import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { CategoryForm } from "~/modules/categories/admin/category-form";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import AdminLayout from "~/components/layouts/admin-layout";

interface IProps {
  categoryId: string;
  storeId: string;
}
const EditCategoryPage: FC<IProps> = ({ categoryId, storeId }) => {
  const getCategory = api.categories.getCategory.useQuery({
    categoryId,
  });

  const isLoading = getCategory.isLoading;
  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}

      {!isLoading && getCategory.data && (
        <CategoryForm initialData={getCategory.data} />
      )}

      {!isLoading && !getCategory.data && (
        <DataFetchErrorMessage message="There seems to be an issue with loading the category." />
      )}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx, (ctx) => {
    return {
      props: {
        categoryId: ctx.query.categoryId,
        storeId: ctx.query.storeId,
      },
    };
  });
}

export default EditCategoryPage;
