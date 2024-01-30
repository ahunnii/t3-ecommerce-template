import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";

import { CollectionsClient } from "~/modules/collections/client";

import AdminLayout from "~/components/layouts/admin-layout";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";

interface IProps {
  storeId: string;
}

const CategoriesPage: FC<IProps> = ({ storeId }) => {
  const { data: collections, isLoading } =
    api.collections.getAllCollections.useQuery({
      storeId,
    });

  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}
      {!isLoading && (
        <div className="flex h-full flex-col">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <CollectionsClient data={collections ?? []} />
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { store, user, redirect } = await authenticateAdminOrOwner(ctx);

  if (!store || !user) return { redirect };

  return {
    props: {
      storeId: ctx.query.storeId,
    },
  };
}

export default CategoriesPage;
