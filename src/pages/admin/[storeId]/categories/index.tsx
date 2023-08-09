import { format } from "date-fns";

import { CategoriesClient } from "~/components/admin/categories/client";
import type { CategoryColumn } from "~/components/admin/categories/columns";

import { api } from "~/utils/api";

import type { GetServerSidePropsContext } from "next";

import { Billboard, Category, Color } from "@prisma/client";
import { useEffect, useState } from "react";

import AdminLayout from "~/layouts/AdminLayout";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const userId = session.user.id;

  const store = await prisma.store.findFirst({
    where: {
      id: ctx.query.storeId as string,
      userId,
    },
  });

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
      params: ctx.query,
    },
  };
}

type UpdatedCategory = Category & { billboard: Billboard };

const CategoriesPage = ({ params }: { params: { storeId: string } }) => {
  const [formattedCategories, setFormattedCategories] = useState<
    CategoryColumn[]
  >([]);

  const { data: categories } = api.categories.getAllCategories.useQuery({
    storeId: params?.storeId,
  });

  useEffect(() => {
    if (categories) {
      setFormattedCategories(
        categories?.map((item: UpdatedCategory) => ({
          id: item.id,
          name: item.name,
          billboardLabel: item.billboard.label,
          createdAt: format(item.createdAt, "MMMM do, yyyy"),
        }))
      );
    }
  }, [categories]);

  return (
    <AdminLayout>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <CategoriesClient data={formattedCategories} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default CategoriesPage;
