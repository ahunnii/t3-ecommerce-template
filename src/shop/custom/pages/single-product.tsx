import { useParams } from "next/navigation";
import type { FC } from "react";

import Info from "~/components/core/info";

import Breadcrumbs from "~/modules/categories/core/breadcrumbs";
import Gallery from "~/modules/gallery/core";

import StorefrontLayout from "~/layouts/storefront-layout";

import { api } from "~/utils/api";

import type { DetailedProductFull } from "~/types";

import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";
import { RelatedItemsList } from "~/shop/custom/components/related-items-list";
import { storeTheme } from "~/shop/custom/config";

type ProductPageProps = { prevUrl: string; name: string };
export const SingleProductPage: FC<ProductPageProps> = ({ prevUrl, name }) => {
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
  const metadata = {
    title: `${name} | Trend Anomaly`,
    description: "Browse all products available in our shop.",
  };

  return (
    <StorefrontLayout {...storeTheme.layout} metadata={metadata}>
      {isLoading && <AbsolutePageLoader />}

      {!isLoading && product && (
        <>
          <Breadcrumbs pathway={pathway} />
          <div className="mt-6">
            <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
              <Gallery images={product?.images} />

              <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                <Info data={product} variant="default" button={"dark"} />
              </div>
            </div>
            <hr className="my-10" />
            {suggested && (
              <RelatedItemsList
                title="You may also like"
                items={(suggested as DetailedProductFull[]) ?? []}
                variant={"dark"}
              />
            )}
          </div>
        </>
      )}
    </StorefrontLayout>
  );
};
