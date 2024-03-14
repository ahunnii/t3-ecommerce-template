import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";

import { api } from "~/utils/api";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import AdminLayout from "~/components/layouts/admin-layout";

import { ProductForm } from "~/modules/products/components/admin/product-form";
import { authenticateAdminOrOwner } from "~/utils/auth";

interface IProps {
  storeId: string;
  productId: string;
}

const ProductPage: FC<IProps> = ({ storeId, productId }) => {
  const { data: product, isLoading } = api.products.getProduct.useQuery({
    productId,
  });

  const { data: categories } = api.categories.getAllCategories.useQuery({
    storeId,
  });

  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}
      {!isLoading && product && categories && (
        <ProductForm categories={categories ?? []} initialData={product} />
      )}
      {!isLoading && !product && (
        <DataFetchErrorMessage message="There seems to be an issue with loading the product." />
      )}{" "}
      {!isLoading && !categories && (
        <DataFetchErrorMessage message="There seems to be an issue with loading the categories." />
      )}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx, (ctx) => {
    return {
      props: {
        productId: ctx.query.productId,
        storeId: ctx.query.storeId,
      },
    };
  });
}
export default ProductPage;
