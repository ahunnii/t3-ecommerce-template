import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { CollectionForm } from "~/modules/collections/components/admin/collection-form";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { useParams } from "next/navigation";
import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import AdminLayout from "~/components/layouts/admin-layout";

const NewCollectionAdminPage: FC = () => {
  const { storeId } = useParams();
  const getAllProducts = api.products.getAllProducts.useQuery({
    storeId: storeId as string,
  });

  const getAllBillboards = api.billboards.getAllBillboards.useQuery({
    storeId: storeId as string,
  });

  const isLoading = getAllProducts.isLoading || getAllBillboards.isLoading;
  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}

      {!isLoading && getAllBillboards.data && getAllProducts.data && (
        <CollectionForm
          products={getAllProducts.data ?? []}
          billboards={getAllBillboards.data ?? []}
          initialData={null}
        />
      )}

      {!isLoading && !getAllProducts.data && (
        <DataFetchErrorMessage message="There seems to be an issue with loading the products." />
      )}

      {!isLoading && !getAllBillboards.data && (
        <DataFetchErrorMessage message="There seems to be an issue with loading the billboards." />
      )}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default NewCollectionAdminPage;
