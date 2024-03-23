import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import AdminLayout from "~/components/layouts/admin-layout";

import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import { ProductForm } from "~/modules/products/components/admin/product-form";

interface IProps {
  storeId: string;
}

const NewProductPage: FC<IProps> = ({ storeId }) => {
  const { data: categories, isLoading } = api.categories.getCategories.useQuery(
    {
      storeId,
      includeVariants: true,
    }
  );

  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}

      {!isLoading && categories && (
        <ProductForm categories={categories ?? []} initialData={null} />
      )}

      {!isLoading && !categories && (
        <DataFetchErrorMessage message="There seems to be an issue with loading the categories." />
      )}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default NewProductPage;
