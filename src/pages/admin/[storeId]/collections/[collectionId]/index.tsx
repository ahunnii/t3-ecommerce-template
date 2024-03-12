import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { Pencil } from "lucide-react";

import Link from "next/link";
import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import { BackToButton } from "~/components/common/buttons/back-to-button";
import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";

import AdminLayout from "~/components/layouts/admin-layout";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";

import { ViewCollectionPreview } from "~/modules/collections/admin/view-collection-preview";
import { ViewCollectionProducts } from "~/modules/collections/admin/view-collection-products";

interface IProps {
  collectionId: string;
  storeId: string;
}
const CollectionPage: FC<IProps> = ({ collectionId, storeId }) => {
  const { data: collection, isLoading } =
    api.collections.getCollection.useQuery({
      collectionId,
    });

  const editCollectionURL = `/admin/${storeId}/collections/${collection?.id}/edit`;
  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}
      {!isLoading && (
        <div className="flex-1 space-y-4 p-8 pt-6">
          {collection && (
            <>
              <BackToButton
                link={`/admin/${storeId}/collections`}
                title="Back to Collections"
              />
              <div className="flex w-full items-center justify-between">
                <Heading
                  title={collection.name}
                  description={"No description added"}
                />
                <Link href={editCollectionURL}>
                  <Button className="flex gap-2" size={"sm"}>
                    <Pencil className="h-5 w-5" /> Edit Collection
                  </Button>
                </Link>
              </div>
              <div className="flex gap-4">
                <ViewCollectionPreview collection={collection} />
                <ViewCollectionProducts products={collection?.products ?? []} />
              </div>
            </>
          )}
          {!collection && (
            <DataFetchErrorMessage message="There seems to be an issue with loading the category." />
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx, (ctx) => {
    return {
      props: {
        collectionId: ctx.query.collectionId,
        storeId: ctx.query.storeId,
      },
    };
  });
}

export default CollectionPage;
