import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";
import NoResults from "~/components/core/ui/no-results";
import Breadcrumbs from "~/modules/categories/core/breadcrumbs";
import { CollectionCard } from "~/modules/categories/core/collection-card";

import StorefrontLayout from "~/layouts/storefront-layout";

import { api } from "~/utils/api";

import type { DetailedCollection } from "~/types";

import { useConfig } from "~/providers/style-config-provider";
import { cn } from "~/utils/styles";

const metadata = {
  title: "All Collections | Trend Anomaly",
  description:
    "Check out our product collections and find something to break out the system!",
};

export const CollectionPage = () => {
  const { data: collections, isLoading } =
    api.collections.getAllCollections.useQuery({});

  const pathway = [{ name: "Collections" }];
  const config = useConfig();

  return (
    <StorefrontLayout {...config.layout} metadata={metadata}>
      {isLoading && <AbsolutePageLoader />}
      {!isLoading && (
        <>
          <Breadcrumbs pathway={pathway} />
          <h1 className={cn("", config.typography.h1)}>All Collections</h1>

          <div className="mt-6 lg:col-span-4 lg:mt-0">
            {collections?.length === 0 && <NoResults />}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {collections?.map((item: DetailedCollection) => (
                <CollectionCard key={item.id} collection={item} />
              ))}
            </div>{" "}
          </div>
        </>
      )}
    </StorefrontLayout>
  );
};
