import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { Pencil } from "lucide-react";
import Link from "next/link";
import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import { AdminFormBody } from "~/components/common/admin/admin-form-body";
import { AdminFormHeader } from "~/components/common/admin/admin-form-header";

import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import AdminLayout from "~/components/layouts/admin-layout";
import { Button } from "~/components/ui/button";

import { ViewAttributes } from "~/modules/categories/admin/view-attributes";
import { ViewCategoryCollection } from "~/modules/categories/admin/view-category";
import { DetailedCollection } from "~/types";

interface IProps {
  categoryId: string;
  storeId: string;
}
const CategoryPage: FC<IProps> = ({ categoryId, storeId }) => {
  const { data: category, isLoading } = api.categories.getCategory.useQuery({
    categoryId,
  });

  const editCategory = `/admin/${storeId}/categories/${category?.id}/edit`;
  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}

      {!isLoading && category && (
        <>
          <AdminFormHeader
            title={category.name}
            description={"View details about the category at a glance."}
            contentName="Categories"
            link={`/admin/${category.storeId}/categories`}
          >
            <Link href={editCategory}>
              <Button className="flex gap-2" size={"sm"}>
                <Pencil className="h-5 w-5" /> Edit...
              </Button>
            </Link>
          </AdminFormHeader>

          <AdminFormBody>
            <ViewCategoryCollection
              collection={(category?.collection as DetailedCollection) ?? null}
            />
            <ViewAttributes category={category} />
          </AdminFormBody>
        </>
      )}
      {!isLoading && !category && (
        <DataFetchErrorMessage message="There seems to be an issue with loading the category." />
      )}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx, (ctx) => {
    return {
      props: {
        categoryId: ctx.query.categoryId,
        storeId: ctx.query.storeId,
      },
    };
  });
}

export default CategoryPage;
