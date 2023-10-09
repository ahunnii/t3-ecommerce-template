import { format } from "date-fns";
import { useCallback, useEffect, useState, type FC } from "react";

import type { Billboard, Category, Collection } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import type { CollectionColumn } from "~/components/admin/collections/columns";

import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";

import { CollectionsClient } from "~/components/admin/collections/client";
import PageLoader from "~/components/ui/page-loader";
import AdminLayout from "~/layouts/AdminLayout";

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

  const formatCategories = useCallback((collections: Collection[]) => {
    return collections.map((item: Collection) => ({
      id: item.id,
      name: item.name,
      createdAt: format(item.createdAt as Date, "MMMM do, yyyy"),
    }));
  }, []);

  useEffect(() => {
    if (collections)
      setFormattedCollections(
        formatCategories(collections as Collection[]) as CollectionColumn[]
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
