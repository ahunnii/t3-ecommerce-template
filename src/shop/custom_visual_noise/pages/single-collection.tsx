import Head from "next/head";
import type { FC } from "react";

import Breadcrumbs from "~/components/core/category/breadcrumbs";

import Container from "~/components/core/ui/container";
import NoResults from "~/components/core/ui/no-results";
import ProductCard from "~/components/core/ui/product-card";
import PageLoader from "~/components/ui/page-loader";
import StorefrontLayout from "~/layouts/storefront-layout";
import { api } from "~/utils/api";
import Footer from "../components/footer";
import Navbar from "../modules/navigation/navbar";

type ICollectionPageProps = {
  collectionId: string;
};
export const SingleCollectionPage: FC<ICollectionPageProps> = ({
  collectionId,
}) => {
  const { data: collection, isLoading: isCollectionLoading } =
    api.collections.getCollection.useQuery({ collectionId });

  const pathway = [
    {
      name: "Collections",
      link: "/collections",
    },
    {
      name: collection?.name ?? "",
    },
  ];
  return (
    <>
      <Head>
        <title>{collection?.name} | Trend Anomaly</title>
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
        <Container>
          <Breadcrumbs pathway={pathway} variant={"dark"} />
          <div className="px-4 pb-24 sm:px-6 lg:px-8">
            {isCollectionLoading ? (
              <PageLoader />
            ) : (
              <div className="mt-6 lg:col-span-4 lg:mt-0">
                {collection?.products.length === 0 && <NoResults />}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {collection?.products.map((item) => (
                    <ProductCard key={item.id} data={item} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </Container>
      </StorefrontLayout>
    </>
  );
};
