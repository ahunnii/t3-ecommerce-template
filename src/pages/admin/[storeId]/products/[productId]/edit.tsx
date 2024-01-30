import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";

import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";

import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";
import AdminLayout from "~/components/layouts/admin-layout";

import { ProductForm } from "~/modules/products/admin/product-form";

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
      {!isLoading && (
        <div className="flex-1 space-y-4 p-8 pt-6">
          {product && categories && (
            <ProductForm categories={categories ?? []} initialData={product} />
          )}
          {!product && (
            <DataFetchErrorMessage message="There seems to be an issue with loading the product." />
          )}{" "}
          {!categories && (
            <DataFetchErrorMessage message="There seems to be an issue with loading the categories." />
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const store = await authenticateSession(ctx);

  if (!store) {
    return {
      redirect: {
        destination: `/admin`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      storeId: ctx.query.storeId,
      productId: ctx.query.productId,
    },
  };
}

export default ProductPage;
