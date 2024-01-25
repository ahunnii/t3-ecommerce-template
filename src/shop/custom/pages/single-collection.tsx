import type { FC } from "react";

import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";
import NoResults from "~/components/core/ui/no-results";
import ProductCard from "~/components/core/ui/product-card";
import Breadcrumbs from "~/modules/categories/core/breadcrumbs";

import StorefrontLayout from "~/layouts/storefront-layout";

import { api } from "~/utils/api";

import { SEO } from "~/shop/custom/components/seo-head";
import { storeTheme } from "~/shop/custom/config";

type ICollectionPageProps = {
  collectionId: string;
};
export const SingleCollectionPage: FC<ICollectionPageProps> = ({
  collectionId,
}) => {
  const { data: collection, isLoading } =
    api.collections.getCollection.useQuery({ collectionId });

  const pathway = [
    { name: "Collections", link: "/collections" },
    { name: collection?.name ?? "" },
  ];
  return (
    <>
      <SEO
        title={`${collection?.name} | Trend Anomaly`}
        description={
          "Check out our product collections and find something to break out the system!"
        }
      />
      <StorefrontLayout {...storeTheme.layout}>
        {isLoading && <AbsolutePageLoader />}

        {!isLoading && (
          <>
            <Breadcrumbs pathway={pathway} />
            <div className="px-4 pb-24 sm:px-6 lg:px-8">
              <div className="mt-6 lg:col-span-4 lg:mt-0">
                {collection?.products.length === 0 && <NoResults />}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {collection?.products.map((item) => (
                    <ProductCard key={item.id} data={item} />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </StorefrontLayout>
    </>
  );
};
