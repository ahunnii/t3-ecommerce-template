import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";

import { CategoryForm } from "~/components/admin/categories/category-form";
import PageLoader from "~/components/ui/page-loader";
import AdminLayout from "~/layouts/AdminLayout";

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

  return (
    <AdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {typeof category === "undefined" && <PageLoader />}

          {typeof category === "object" && (
            <CategoryForm
              billboards={billboards ?? []}
              initialData={category ?? null}
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
      categoryId: ctx.query.categoryId,
      storeId: ctx.query.storeId,
    },
  };
}

export default CategoryPage;
