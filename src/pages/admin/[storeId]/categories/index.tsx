import { format } from "date-fns";
import { useCallback, useEffect, useState, type FC } from "react";

import type { Billboard, Category } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import type { CategoryColumn } from "~/components/admin/categories/columns";

import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";

import { CategoriesClient } from "~/components/admin/categories/client";
import PageLoader from "~/components/ui/page-loader";
import AdminLayout from "~/layouts/AdminLayout";

interface IProps {
  storeId: string;
}
interface ExtendedCategory extends Category {
  billboard: Billboard;
}

const CategoriesPage: FC<IProps> = ({ storeId }) => {
  const [formattedCategories, setFormattedCategories] = useState<
    CategoryColumn[]
  >([]);

  const { data: categories } = api.categories.getAllCategories.useQuery({
    storeId,
  });

  const formatCategories = useCallback((categories: ExtendedCategory[]) => {
    return categories.map((item: ExtendedCategory) => ({
      id: item.id,
      name: item.name,
      billboardLabel: item.billboard.label,
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
          {!categories && <PageLoader />}
          {categories && <CategoriesClient data={formattedCategories} />}
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
