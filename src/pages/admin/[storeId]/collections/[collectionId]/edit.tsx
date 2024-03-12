import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { CollectionForm } from "~/modules/collections/admin/collection-form";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import AdminLayout from "~/components/layouts/admin-layout";

interface IProps {
  collectionId: string;
  storeId: string;
}
const CollectionPage: FC<IProps> = ({ collectionId, storeId }) => {
  const { data: collection, isLoading: isCollectionLoading } =
    api.collections.getCollection.useQuery({
      collectionId,
    });

  const { data: products, isLoading: areProductsLoading } =
    api.products.getAllProducts.useQuery({
      storeId,
    });
  const { data: billboards, isLoading: areBillboardsLoading } =
    api.billboards.getAllBillboards.useQuery({
      storeId,
    });

  return (
    <AdminLayout>
      {(isCollectionLoading || areProductsLoading || areBillboardsLoading) && (
        <AbsolutePageLoader />
      )}
      {!isCollectionLoading && !areProductsLoading && !areBillboardsLoading && (
        <div className="flex h-full flex-col">
          <div className="flex-1 space-y-4 p-8 pt-6">
            {collection && (
              <CollectionForm
                products={products ?? []}
                billboards={billboards ?? []}
                initialData={collection}
              />
            )}

            {!billboards && (
              <DataFetchErrorMessage message="There seems to be an issue with loading the billboards." />
            )}

            {!products && (
              <DataFetchErrorMessage message="There seems to be an issue with loading the products." />
            )}
          </div>
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
