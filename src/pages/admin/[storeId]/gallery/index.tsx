import type { GetServerSidePropsContext } from "next";
import { useCallback, useEffect, useState, type FC } from "react";

import { format } from "date-fns";

import PageLoader from "~/components/ui/page-loader";
import { CategoriesClient } from "~/modules/categories/admin/client";
import type { CategoryColumn } from "~/modules/categories/admin/columns";

import AdminLayout from "~/components/layouts/AdminLayout";

import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";

import type { DetailedCategory } from "~/types";

interface IProps {
  storeId: string;
}
const CategoriesPage: FC<IProps> = ({ storeId }) => {
  const [formattedCategories, setFormattedCategories] = useState<
    CategoryColumn[]
  >([]);

  const { data: categories, isLoading } =
    api.categories.getAllCategories.useQuery({
      storeId,
    });

  const formatCategories = useCallback((categories: DetailedCategory[]) => {
    return categories.map((item: DetailedCategory) => ({
      id: item.id,
      name: item.name,
      billboardLabel: item?.billboard?.label,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));
  }, []);

  useEffect(() => {
    if (categories)
      setFormattedCategories(formatCategories(categories) as CategoryColumn[]);
  }, [categories, formatCategories]);

  return (
    <AdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {isLoading ? (
            <PageLoader />
          ) : (
            <CategoriesClient data={formattedCategories} />
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
      storeId: ctx.query.storeId,
    },
  };
}

export default CategoriesPage;
