import { type FC } from "react";

import type { GetServerSidePropsContext } from "next";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import AdminLayout from "~/components/layouts/admin-layout";

import { ProductsClient } from "~/modules/products/admin/client";

interface IProps {
  storeId: string;
}

const ProductsPage: FC<IProps> = ({ storeId }) => {
  const { data: products, isLoading } = api.products.getAllProducts.useQuery({
    storeId,
  });

  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <ProductsClient data={products ?? []} />
        </div>
      </div>
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}
export default ProductsPage;
