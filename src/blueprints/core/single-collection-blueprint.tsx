import type { FC } from "react";

import Breadcrumbs from "~/components/common/breadcrumb-bar/breadcrumbs";

import NoResults from "~/components/common/no-results";
import ProductCard from "~/components/core/ui/product-card";
import StorefrontLayout from "~/components/layouts/storefront-layout";
import PageLoader from "~/components/ui/page-loader";
import type { DetailedProductFull } from "~/types";

import { api } from "~/utils/api";

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
    <StorefrontLayout>
      <Breadcrumbs pathway={pathway} />
      <div className="px-4 pb-24 sm:px-6 lg:px-8">
        {isCollectionLoading ? (
          <PageLoader />
        ) : (
          <div className="mt-6 lg:col-span-4 lg:mt-0">
            {collection?.products.length === 0 && <NoResults />}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {collection?.products.map((item: DetailedProductFull) => (
                <ProductCard key={item.id} data={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
};
