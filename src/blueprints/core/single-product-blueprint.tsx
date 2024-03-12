import { useParams } from "next/navigation";

import PageLoader from "~/components/ui/page-loader";

import ProductPageInfo from "~/modules/products/components/single-product/product-page-info";
import ProductList from "~/modules/products/core/product-list";

import StorefrontLayout from "~/components/layouts/storefront-layout";

import { api } from "~/utils/api";

import Breadcrumbs from "~/components/common/breadcrumb-bar/breadcrumbs";

import { ProductGallery } from "~/modules/products/core/product-gallery";
import type { DetailedProductFull } from "~/types";

export const SingleProductPage = ({ prevUrl }: { prevUrl: string }) => {
  const params = useParams();

  const { data: product, isLoading } = api.products.getProduct.useQuery({
    productId: params?.productId as string,
  });

  const { data: collection } = api.collections.getCollection.useQuery({
    collectionId: prevUrl
      ? prevUrl.includes("collections")
        ? prevUrl.split("/")[4]!
        : ""
      : "",
  });

  const { data: suggested } = api.products.getAllSuggestedProducts.useQuery({
    categoryId: product?.category?.id ?? "",
  });

  const pathway =
    prevUrl && prevUrl.includes("collections")
      ? [
          {
            name: "Collections",
            link: "/collections",
          },

          {
            name: collection?.name ?? "All Products",
            link: `/collections/${collection?.id ?? "all-products"}`,
          },

          {
            name: product?.name ?? "",
          },
        ]
      : [
          {
            name: "Products",
            link: "/collections/all-products",
          },

          {
            name: product?.name ?? "",
          },
        ];

  return (
    <>
      <StorefrontLayout>
        {isLoading && <PageLoader />}
        <Breadcrumbs pathway={pathway} />
        {!isLoading && product && (
          <div className="px-4 pb-5 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
              <ProductGallery images={product?.images ?? []} />

              <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                <ProductPageInfo data={product} discounts={[]} />
              </div>
            </div>
            <hr className="my-10" />
            {suggested && (
              <ProductList
                title="Related Items"
                items={(suggested as DetailedProductFull[]) ?? []}
              />
            )}
          </div>
        )}
      </StorefrontLayout>
    </>
  );
};
