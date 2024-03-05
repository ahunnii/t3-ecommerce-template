import type { FC } from "react";

import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";
import Breadcrumbs from "~/components/core/breadcrumbs";
import NoResults from "~/components/core/ui/no-results";
import ProductCard from "~/components/core/ui/product-card";

import StorefrontLayout from "~/components/layouts/storefront-layout";

import { api } from "~/utils/api";

import { useConfig } from "~/providers/style-config-provider";

import { cn } from "~/utils/styles";

type ICollectionPageProps = {
  collectionId: string;
};

export const SingleCollectionPage: FC<ICollectionPageProps> = ({
  collectionId,
}) => {
  const { data: collection, isLoading } =
    api.collections.getCollection.useQuery({ collectionId });

  const config = useConfig();
  const pathway = [
    { name: "Collections", link: "/collections" },
    { name: collection?.name ?? "" },
  ];

  const metadata = {
    title: `${collection?.name} | Trend Anomaly`,
    description:
      "Check out our product collections and find something to break out the system!",
  };
  return (
    <StorefrontLayout {...config.layout} metadata={metadata}>
      {isLoading && <AbsolutePageLoader />}

      {!isLoading && (
        <>
          <Breadcrumbs pathway={pathway} />
          <h1 className={cn("", config.typography.h1)}>{collection?.name}</h1>
          <div className="mt-6 lg:col-span-4">
            {collection?.products.length === 0 && <NoResults />}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {collection?.products.map((item) => (
                <ProductCard key={item.id} data={item} />
              ))}{" "}
            </div>
          </div>
        </>
      )}
    </StorefrontLayout>
  );
};
