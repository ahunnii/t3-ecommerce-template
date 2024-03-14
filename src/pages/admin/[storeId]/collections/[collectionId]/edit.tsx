import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { CollectionForm } from "~/modules/collections/components/admin/collection-form";

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
  const getCollection = api.collections.getCollection.useQuery({
    collectionId,
  });

  const getAllProducts = api.products.getAllProducts.useQuery({
    storeId,
  });

  const isLoading = getCollection.isLoading || getAllProducts.isLoading;

  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}

      {!isLoading && getCollection.data && getAllProducts.data && (
        <CollectionForm
          products={getAllProducts.data ?? []}
          initialData={getCollection.data}
        />
      )}

      {!isLoading && !getAllProducts.data && (
        <DataFetchErrorMessage message="There seems to be an issue with loading the products." />
      )}

      {!isLoading && !getCollection.data && (
        <DataFetchErrorMessage message="There seems to be an issue with loading the collection." />
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
