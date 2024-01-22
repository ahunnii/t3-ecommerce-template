import { useParams } from "next/navigation";

import Gallery from "~/components/core/gallery";
import Info from "~/components/core/info";
import ProductList from "~/components/core/product/product-list";
import PageLoader from "~/components/ui/page-loader";

import StorefrontLayout from "~/layouts/storefront-layout";

import { api } from "~/utils/api";

import type { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Breadcrumbs from "~/components/core/category/breadcrumbs";

import { prisma } from "~/server/db";
import type { DetailedProductFull } from "~/types";

import Container from "~/components/core/ui/container";
import Footer from "../components/footer";
import Navbar from "../modules/navigation/navbar";

export const SingleProductPage = ({
  prevUrl,
  name,
}: {
  name: string;
  prevUrl: string;
}) => {
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
      <Head>
        <title>{name} | Store Co.</title>
        <meta name="description" content="Admin" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <StorefrontLayout
        mainStyle="bg-black/90"
        bodyStyle="max-w-full"
        navStyles="bg-black border-b-black"
        NavBar={Navbar}
        Footer={Footer}
      >
        {isLoading && <PageLoader />}
        <Container>
          <Breadcrumbs pathway={pathway} variant={"dark"} />
          {!isLoading && product && (
            <div className="px-4 pb-5 sm:px-6 lg:px-8">
              <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
                <Gallery images={product?.images} />

                <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                  <Info data={product} variant="dark" button={"dark"} />
                </div>
              </div>
              <hr className="my-10" />
              {suggested && (
                <ProductList
                  title="Related Items"
                  items={(suggested as DetailedProductFull[]) ?? []}
                  variant={"dark"}
                />
              )}
            </div>
          )}
        </Container>
      </StorefrontLayout>
    </>
  );
};
