import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner, authenticateSession } from "~/utils/auth";

import { Pencil } from "lucide-react";
import Link from "next/link";
import { BackToButton } from "~/components/common/buttons/back-to-button";
import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";
import AdminLayout from "~/components/layouts/admin-layout";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { ViewAttributes } from "~/modules/categories/admin/view-attributes";
import { ViewCategory } from "~/modules/categories/admin/view-category";

interface IProps {
  categoryId: string;
  storeId: string;
}
const CategoryPage: FC<IProps> = ({ categoryId, storeId }) => {
  const { data: category, isLoading: isCategoryLoading } =
    api.categories.getCategory.useQuery({
      categoryId,
    });

  const { data: billboards, isLoading: areBillboardsLoading } =
    api.billboards.getAllBillboards.useQuery({
      storeId,
    });

  const editCategory = `/admin/${category?.storeId}/categories/${category?.id}/edit`;
  return (
    <AdminLayout>
      {isCategoryLoading && areBillboardsLoading && <AbsolutePageLoader />}

      {!isCategoryLoading && !areBillboardsLoading && (
        <div className="flex-1 space-y-4 p-8 pt-6">
          {category && billboards && (
            <>
              <BackToButton
                link={`/admin/${category.storeId}/categories`}
                title="Back to Categories"
              />
              <div className="flex w-full items-center justify-between">
                <Heading
                  title={category.name}
                  description={"No description added"}
                />
                <Link href={editCategory}>
                  <Button className="flex gap-2" size={"sm"}>
                    <Pencil className="h-5 w-5" /> Edit Category
                  </Button>
                </Link>
              </div>

              <div className="flex space-x-4">
                <ViewCategory category={category} />
                <ViewAttributes category={category} />
              </div>
            </>
          )}
          {!category && (
            <DataFetchErrorMessage message="There seems to be an issue with loading the category." />
          )}
          {!billboards && (
            <DataFetchErrorMessage message="There seems to be an issue with loading the billboards." />
          )}
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
      categoryId: ctx.query.categoryId,
      storeId: ctx.query.storeId,
    },
  };
}

export default CategoryPage;
