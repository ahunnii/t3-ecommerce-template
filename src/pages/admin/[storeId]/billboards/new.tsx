import type { GetServerSidePropsContext } from "next";

import { BillboardForm } from "~/modules/billboards/admin/billboard-form";

import { authenticateAdminOrOwner } from "~/utils/auth";

import AdminLayout from "~/components/layouts/admin-layout";

const NewBillboardPage = () => {
  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={null} />
      </div>
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default NewBillboardPage;
