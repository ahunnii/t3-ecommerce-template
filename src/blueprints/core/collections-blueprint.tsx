import Breadcrumbs from "~/components/core/breadcrumbs";
import { CollectionCard } from "~/modules/categories/core/collection-card";

import NoResults from "~/components/core/ui/no-results";

import StorefrontLayout from "~/components/layouts/storefront-layout";
import PageLoader from "~/components/ui/page-loader";
import type { DetailedCollection } from "~/types";
import { api } from "~/utils/api";

export const CollectionPage = () => {
  const { data: collections, isLoading } =
    api.collections.getAllCollections.useQuery({});

  const pathway = [
    {
      name: "Collections",
    },
  ];

  return (
    <StorefrontLayout>
      <Breadcrumbs pathway={pathway} />
      <div className="px-4 pb-24 sm:px-6 lg:px-8">
        {isLoading ? (
          <PageLoader />
        ) : (
          <div className="mt-6 lg:col-span-4 lg:mt-0">
            {collections?.length === 0 && <NoResults />}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {collections?.map((item: DetailedCollection) => (
                <CollectionCard key={item.id} collection={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
};
