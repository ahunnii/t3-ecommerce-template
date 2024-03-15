import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import { AdminFormBody } from "~/components/common/admin/admin-form-body";
import { AdminFormHeader } from "~/components/common/admin/admin-form-header";

import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import AdminLayout from "~/components/layouts/admin-layout";

import {
  ViewAvailableAttributes,
  ViewCategoryCollection,
  ViewCategoryProducts,
} from "~/modules/categories/components/view-admin";

import { AdminEditButton } from "~/components/common/buttons/admin-edit-button";
import { ViewSection } from "~/components/common/sections/view-section.admin";
import { AdvancedDataTable } from "~/components/common/tables/advanced-data-table";
import { productColumn } from "~/modules/categories/components/view-admin/product-columns";
import type { DetailedCollection } from "~/modules/collections/types";
import type { CategoryProduct } from "~/modules/products/types";

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
            title={`Category: ${category.name}`}
            description={"View details about the category at a glance."}
            contentName="Categories"
            link={`/admin/${category.storeId}/categories`}
          >
            <AdminEditButton href={editCategory} />
          </AdminFormHeader>

          <AdminFormBody className="space-y-0">
            <ViewSection
              title="Products"
              description="These are all the products associated with this category"
              bodyClassName="mt-4"
              className="w-full lg:w-9/12"
            >
              <AdvancedDataTable
                searchKey="name"
                columns={productColumn}
                data={category.products as CategoryProduct[]}
              />
            </ViewSection>

            <div className="flex w-full flex-col space-y-4 lg:w-3/12">
              <ViewAvailableAttributes category={category} />
              <ViewCategoryCollection
                collection={
                  (category?.collection as DetailedCollection) ?? null
                }
              />
            </div>
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
