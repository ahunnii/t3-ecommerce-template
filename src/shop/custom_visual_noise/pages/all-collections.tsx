import Head from "next/head";
import Breadcrumbs from "~/components/core/category/breadcrumbs";
import { CollectionCard } from "~/components/core/category/collection-card";
import Container from "~/components/core/ui/container";

import NoResults from "~/components/core/ui/no-results";

import PageLoader from "~/components/ui/page-loader";
import StorefrontLayout from "~/layouts/storefront-layout";
import type { DetailedCollection } from "~/types";
import { api } from "~/utils/api";
import Footer from "../components/footer";
import Navbar from "../modules/navigation/navbar";
export const CollectionPage = () => {
  const { data: collections, isLoading } =
    api.collections.getAllCollections.useQuery({});

  const pathway = [
    {
      name: "Collections",
    },
  ];

  return (
    <>
      <Head>
        <title>All Collections | Trend Anomaly</title>
        <meta name="description" content="Admin" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <StorefrontLayout
        mainStyle="bg-black"
        bodyStyle="max-w-full"
        navStyles="bg-black border-b-black"
        NavBar={Navbar}
        Footer={Footer}
      >
        <Container>
          <Breadcrumbs pathway={pathway} variant={"dark"} />
          <div className="px-4 pb-24 sm:px-6 lg:px-8">
            {isLoading ? (
              <PageLoader />
            ) : (
              <div className="mt-6 lg:col-span-4 lg:mt-0">
                {collections?.length === 0 && <NoResults />}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {collections?.map((item: DetailedCollection) => (
                    <CollectionCard
                      key={item.id}
                      collection={item}
                      // aspectRatio="square"
                      // width={150}
                      // height={150}
                    />
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
