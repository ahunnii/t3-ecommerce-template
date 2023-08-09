import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";
import { CategoryForm } from "~/components/admin/categories/category-form";
import AdminLayout from "~/layouts/AdminLayout";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

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
      categoryId: ctx.query.categoryId,
      storeId: ctx.query.storeId,
    },
  };
}
interface IProps {
  categoryId: string;
  storeId: string;
}
const CategoryPage: FC<IProps> = ({ categoryId, storeId }) => {
  const { data: category } = api.categories.getCategory.useQuery({
    categoryId,
  });

  const { data: billboards } = api.billboards.getAllBillboards.useQuery({
    storeId,
  });

  // const category = await prismadb.category.findUnique({
  //   where: {
  //     id: params.categoryId,
  //   },
  // });

  // const billboards = await prismadb.billboard.findMany({
  //   where: {
  //     storeId: params.storeId,
  //   },
  // });

  return (
    <AdminLayout>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {/* <CategoryForm billboards={billboards} initialData={category} /> */}

          {category && billboards && (
            <CategoryForm billboards={billboards} initialData={category} />
          )}
          {category && !billboards && (
            <CategoryForm billboards={[]} initialData={category} />
          )}
          {!category && billboards && (
            <CategoryForm billboards={billboards} initialData={null} />
          )}
          {!category && !billboards && (
            <CategoryForm billboards={[]} initialData={null} />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CategoryPage;
