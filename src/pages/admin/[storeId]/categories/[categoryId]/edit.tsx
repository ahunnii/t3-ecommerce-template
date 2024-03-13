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

  const getAllBillboards = api.billboards.getAllBillboards.useQuery({
    storeId,
  });

  const isLoading = getCategory.isLoading || getAllBillboards.isLoading;
  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}

      {!isLoading && getCategory.data && getAllBillboards.data && (
        <CategoryForm
          initialData={getCategory.data}
          billboards={getAllBillboards.data}
        />
      )}

      {!isLoading && !getCategory.data && (
        <DataFetchErrorMessage message="There seems to be an issue with loading the category." />
      )}

      {!isLoading && !getAllBillboards.data && (
        <DataFetchErrorMessage message="There seems to be an issue with loading the billboards." />
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
