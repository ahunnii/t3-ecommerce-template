import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";

import type { Collection } from "@prisma/client";
import { CollectionForm } from "~/components/admin/collections/collection-form";
import PageLoader from "~/components/ui/page-loader";
import AdminLayout from "~/layouts/AdminLayout";

interface IProps {
  collectionId: string;
  storeId: string;
}
const CollectionPage: FC<IProps> = ({ collectionId, storeId }) => {
  const { data: collection } = api.collections.getCollection.useQuery({
    collectionId,
  });

  const { data: products } = api.products.getAllProducts.useQuery({
    storeId,
  });
  const { data: billboards } = api.billboards.getAllBillboards.useQuery({
    storeId,
  });

  return (
    <AdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {typeof collection === "undefined" && <PageLoader />}

          {typeof collection === "object" && (
            <CollectionForm
              products={products ?? []}
              billboards={billboards ?? []}
              initialData={(collection as Collection) ?? null}
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
