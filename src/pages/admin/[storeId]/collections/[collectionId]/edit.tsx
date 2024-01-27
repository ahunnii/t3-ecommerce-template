import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import PageLoader from "~/components/ui/page-loader";
import { CollectionForm } from "~/modules/collections/collection-form";

import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";

import AdminLayout from "~/components/layouts/AdminLayout";

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
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {isCollectionLoading || areProductsLoading || areBillboardsLoading ? (
            <PageLoader />
          ) : (
            <CollectionForm
              products={products ?? []}
              billboards={billboards ?? []}
              initialData={collection ?? null}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const store = await authenticateSession(ctx);

  if (!store) {
    return {
      redirect: {
        destination: `/admin`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      collectionId: ctx.query.collectionId,
      storeId: ctx.query.storeId,
    },
  };
}

export default CollectionPage;
