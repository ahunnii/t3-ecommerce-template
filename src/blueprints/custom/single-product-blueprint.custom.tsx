import { useParams } from "next/navigation";
import { type FC } from "react";

import Info from "~/modules/products/core/info";

import Breadcrumbs from "~/components/common/breadcrumb-bar/breadcrumbs";
import Gallery from "~/modules/gallery/core";

import StorefrontLayout from "~/components/layouts/storefront-layout";

import { api } from "~/utils/api";

import type { DetailedProductFull } from "~/types";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import { RelatedItemsList } from "~/components/wip/related-items-list.wip";
import { storeTheme } from "~/data/config.custom";

type ProductPageProps = { prevUrl: string; name: string };

export const SingleProductPage: FC<ProductPageProps> = ({ prevUrl, name }) => {
  const params = useParams();

  const { data: sales } = api.discounts.getActiveSiteSales.useQuery({});

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
              <Gallery
                images={
                  product?.images?.length > 0
                    ? product?.images
                    : [
                        {
                          id: "1",
                          url: "/placeholder-image.webp",
                        },
                      ]
                }
              />

              <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                <Info
                  data={product}
                  variant="default"
                  button={"dark"}
                  discounts={
                    [...(sales ?? []), ...(product?.discounts ?? [])] ?? []
                  }
                />
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
