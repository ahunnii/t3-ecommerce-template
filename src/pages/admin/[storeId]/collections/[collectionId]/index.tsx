import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { Pencil } from "lucide-react";

import Link from "next/link";
import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";

import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";

import AdminLayout from "~/components/layouts/admin-layout";
import { Button } from "~/components/ui/button";

import { AdminFormBody } from "~/components/common/admin/admin-form-body";
import { AdminFormHeader } from "~/components/common/admin/admin-form-header";
import { ViewCollectionPreview } from "~/modules/collections/components/admin/view-collection-preview";
import { ViewCollectionProducts } from "~/modules/collections/components/admin/view-collection-products";

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
      {!isLoading && collection && (
        <>
          <AdminFormHeader
            title={collection.name}
            description={"View details about the collection at a glance"}
            contentName="Collection"
            link={`/admin/${storeId}/collections`}
          >
            <Link href={editCollectionURL}>
              <Button className="flex gap-2" size={"sm"}>
                <Pencil className="h-5 w-5" /> Edit...
              </Button>
            </Link>
          </AdminFormHeader>

          <AdminFormBody className="mx-auto max-w-7xl">
            <ViewCollectionPreview collection={collection} />
            <ViewCollectionProducts products={collection?.products ?? []} />
          </AdminFormBody>
        </>
      )}
      {!isLoading && !collection && (
        <DataFetchErrorMessage message="There seems to be an issue with loading the category." />
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
