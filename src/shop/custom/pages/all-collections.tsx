import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";
import NoResults from "~/components/core/ui/no-results";
import Breadcrumbs from "~/modules/categories/core/breadcrumbs";
import { CollectionCard } from "~/modules/categories/core/collection-card";

import StorefrontLayout from "~/layouts/storefront-layout";

import { api } from "~/utils/api";

import type { DetailedCollection } from "~/types";

import { SEO } from "~/shop/custom/components/seo-head";
import { storeTheme } from "~/shop/custom/config";

export const CollectionPage = () => {
  const { data: collections, isLoading } =
    api.collections.getAllCollections.useQuery({});

  const pathway = [{ name: "Collections" }];

  return (
    <>
      <SEO
        title={`All Collections | Trend Anomaly`}
        description={
          "Check out our product collections and find something to break out the system!"
        }
      />
      <StorefrontLayout {...storeTheme.layout}>
        {isLoading && <AbsolutePageLoader />}
        {!isLoading && (
          <>
            <Breadcrumbs pathway={pathway} variant={"dark"} />
            <div className="px-4 pb-24 sm:px-6 lg:px-8">
              <div className="mt-6 lg:col-span-4 lg:mt-0">
                {collections?.length === 0 && <NoResults />}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {collections?.map((item: DetailedCollection) => (
                    <CollectionCard key={item.id} collection={item} />
                  ))}
                </div>
              </div>{" "}
            </div>
          </>
        )}
      </StorefrontLayout>
    </>
  );
};
