import type { GetServerSidePropsContext } from "next";

import { prisma } from "~/server/db";

import { useParams } from "next/navigation";
import { type FC } from "react";

import ProductPageInfo from "~/modules/products/components/single-product/product-page-info";

import ProductImageGallery from "~/modules/products/components/product-image-gallery";

import StorefrontLayout from "~/components/layouts/storefront-layout";

import { api } from "~/utils/api";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import { TaBreadCrumbs } from "~/components/custom/ta-breadcrumbs.custom";

import { Separator } from "~/components/ui/separator";
import { RelatedItemsList } from "~/components/wip/related-items-list.wip";
import { storeTheme } from "~/data/config.custom";
import type { DetailedProductFull } from "~/modules/products/types";
import { CreateReviewDialog } from "~/modules/reviews/components/create-review-dialog";
import { ReviewTemplate } from "~/modules/reviews/components/review-template";
import { cn } from "~/utils/styles";

type ProductPageProps = { prevUrl: string; name: string };

const SingleProductPage: FC<ProductPageProps> = ({ prevUrl, name }) => {
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
          <TaBreadCrumbs pathway={pathway} />

          <div className="mt-6">
            <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
              <ProductImageGallery
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
                <ProductPageInfo
                  data={product}
                  variant="default"
                  button={"dark"}
                  discounts={
                    [...(sales ?? []), ...(product?.discounts ?? [])] ?? []
                  }
                />
              </div>
            </div>
            <Separator className="my-10 bg-zinc-400" />

            <div className="mb-4 flex items-center justify-between">
              <h3 className={cn("text-3xl font-bold ")}>Reviews</h3>
              <CreateReviewDialog
                productId={product?.id}
                reviews={product?.reviews ?? []}
              />
            </div>

            {product?.reviews?.map((review) => (
              <ReviewTemplate {...review} key={review.id} />
            ))}

            {!product?.reviews?.length && (
              <p>No reviews yet. Be the first one and write a review!</p>
            )}

            <Separator className="my-10 bg-zinc-400" />

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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { productId } = context.params!;

  const product = await prisma.product.findUnique({
    where: {
      id: productId as string,
    },
  });

  if (!product)
    return {
      notFound: true,
    };
  return {
    props: {
      prevUrl: context.req.headers.referer ?? "",
      name: product?.name ?? "",
    },
  };
}

export default SingleProductPage;
