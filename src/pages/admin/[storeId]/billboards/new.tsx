import type { GetServerSidePropsContext } from "next";

import { BillboardForm } from "~/modules/billboards/components/admin/billboard-form";

import { authenticateAdminOrOwner } from "~/utils/auth";

import AdminLayout from "~/components/layouts/admin-layout";

const NewBillboardPage = () => {
  return (
    <AdminLayout>
      <BillboardForm initialData={null} />
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default NewBillboardPage;
