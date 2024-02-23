import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { CollectionForm } from "~/modules/collections/collection-form";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { useParams } from "next/navigation";
import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";
import AdminLayout from "~/components/layouts/admin-layout";

const NewCollectionPage: FC = () => {
  const { storeId } = useParams();
  const { data: products, isLoading: areProductsLoading } =
    api.products.getAllProducts.useQuery({
      storeId: storeId as string,
    });
  const { data: billboards, isLoading: areBillboardsLoading } =
    api.billboards.getAllBillboards.useQuery({
      storeId: storeId as string,
    });

  return (
    <AdminLayout>
      {(areProductsLoading || areBillboardsLoading) && <AbsolutePageLoader />}
      {!areProductsLoading && !areBillboardsLoading && (
        <div className="flex h-full flex-col">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <CollectionForm
              products={products ?? []}
              billboards={billboards ?? []}
              initialData={null}
            />

            {!billboards && (
              <DataFetchErrorMessage message="There seems to be an issue with loading the billboards." />
            )}

            {!products && (
              <DataFetchErrorMessage message="There seems to be an issue with loading the products." />
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default NewCollectionPage;
