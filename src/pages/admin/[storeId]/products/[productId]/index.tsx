import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { BackToButton } from "~/components/common/buttons/back-to-button";
import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";
import AdminLayout from "~/components/layouts/admin-layout";

import { ViewProductAttributes } from "~/modules/products/admin/view-product-attributes";
import { ViewProductDetails } from "~/modules/products/admin/view-product-details";
import { ViewProductImages } from "~/modules/products/admin/view-product-images";
import { ViewProductsShipping } from "~/modules/products/admin/view-product-shipping";
import { ViewProductVariants } from "~/modules/products/admin/view-product-variants";

interface IProps {
  storeId: string;
  productId: string;
}

const ProductPage: FC<IProps> = ({ storeId, productId }) => {
  const { data: product, isLoading } = api.products.getProduct.useQuery({
    productId,
  });

  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}

      {!isLoading && (
        <div className="flex-1 space-y-4 p-8 pt-6">
          {product && (
            <>
              <BackToButton
                link={`/admin/${storeId}/products`}
                title="Back to Products"
              />
              <section className="flex w-full gap-4 max-lg:flex-col">
                <div className="flex w-full flex-col space-y-4 lg:w-8/12">
                  <ViewProductDetails {...product} />
                  <ViewProductVariants {...product} />
                  <ViewProductAttributes {...product} />
                  <ViewProductsShipping {...product} />
                </div>
                <div className="flex w-full flex-col lg:w-4/12">
                  <ViewProductImages {...product} />
                </div>
              </section>
            </>
          )}
          {!product && (
            <DataFetchErrorMessage message="There seems to be an issue with loading the products." />
          )}
        </div>
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
