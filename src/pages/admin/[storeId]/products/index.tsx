import { type FC } from "react";

import type { GetServerSidePropsContext } from "next";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import AdminLayout from "~/components/layouts/admin-layout";

import { ProductsClient } from "~/modules/products/components/admin/client";

interface IProps {
  storeId: string;
}

const ProductsPage: FC<IProps> = ({ storeId }) => {
  const { data: products, isLoading } = api.products.getAllProducts.useQuery({
    storeId,
    isAdmin: true,
  });

  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}
      {!isLoading && <ProductsClient data={products ?? []} />}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}
export default ProductsPage;
