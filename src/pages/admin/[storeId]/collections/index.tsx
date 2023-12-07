import type { GetServerSidePropsContext } from "next";
import { useCallback, useEffect, useState, type FC } from "react";

import { format } from "date-fns";

import { CollectionsClient } from "~/components/admin/collections/client";
import type { CollectionColumn } from "~/components/admin/collections/columns";
import PageLoader from "~/components/ui/page-loader";

import AdminLayout from "~/layouts/AdminLayout";

import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";

import type { DetailedCollection } from "~/types";

interface IProps {
  storeId: string;
}

const CategoriesPage: FC<IProps> = ({ storeId }) => {
  const [formattedCollections, setFormattedCollections] = useState<
    CollectionColumn[]
  >([]);

  const { data: collections } = api.collections.getAllCollections.useQuery({
    storeId,
  });

  const formatCategories = useCallback((collections: DetailedCollection[]) => {
    return collections.map((item: DetailedCollection) => ({
      id: item.id,
      name: item.name,
      products: item.products.length,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));
  }, []);

  useEffect(() => {
    if (collections)
      setFormattedCollections(
        formatCategories(collections) as CollectionColumn[]
      );
  }, [collections, formatCategories]);

  return (
    <AdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {!collections && <PageLoader />}
          {collections && <CollectionsClient data={formattedCollections} />}
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
      storeId: ctx.query.storeId,
    },
  };
}

export default CategoriesPage;
