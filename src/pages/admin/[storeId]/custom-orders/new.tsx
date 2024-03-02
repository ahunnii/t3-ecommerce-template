import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { CustomOrderForm } from "~/modules/custom-orders/admin/custom-order-form";

import { authenticateAdminOrOwner } from "~/utils/auth";

import AdminLayout from "~/components/layouts/admin-layout";

const NewBillboardPage: FC = () => {
  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CustomOrderForm initialData={null} />
      </div>
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default NewBillboardPage;
