import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";
import AdminLayout from "~/components/layouts/admin-layout";

import { ProductForm } from "~/modules/products/admin/product-form";

interface IProps {
  storeId: string;
}

const NewProductPage: FC<IProps> = ({ storeId }) => {
  const { data: categories, isLoading } =
    api.categories.getAllCategories.useQuery({
      storeId,
    });

  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}
      {!isLoading && (
        <div className="flex-1 space-y-4 p-8 pt-6">
          <ProductForm categories={categories ?? []} initialData={null} />
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

export default NewProductPage;
