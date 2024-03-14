import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { CustomOrderForm } from "~/modules/custom-orders/components/admin/custom-order-form";

import { authenticateAdminOrOwner } from "~/utils/auth";

import AdminLayout from "~/components/layouts/admin-layout";

const NewBillboardPage: FC = () => {
  return (
    <AdminLayout>
      <CustomOrderForm initialData={null} />
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default NewBillboardPage;
