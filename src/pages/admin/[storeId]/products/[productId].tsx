import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";

import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";

import { ProductForm } from "~/components/admin/products/product-form";
import PageLoader from "~/components/ui/page-loader";
import AdminLayout from "~/layouts/AdminLayout";

interface IProps {
  storeId: string;
  productId: string;
}

const ProductPage: FC<IProps> = ({ storeId, productId }) => {
  const { data: product } = api.products.getProduct.useQuery({
    productId,
  });

  const { data: categories } = api.categories.getAllCategories.useQuery({
    storeId,
  });
  const { data: sizes } = api.sizes.getAllSizes.useQuery({
    storeId,
  });

  const { data: colors } = api.colors.getAllColors.useQuery({
    storeId,
  });

  return (
    <AdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {typeof product === "undefined" && <PageLoader />}
          {typeof product === "object" && (
            <ProductForm
              categories={categories ?? []}
              colors={colors ?? []}
              sizes={sizes ?? []}
              initialData={product ?? null}
            />
          )}
        </div>
      </div>
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
