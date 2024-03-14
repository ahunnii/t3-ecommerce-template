import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { CategoryForm } from "~/modules/categories/admin/category-form";

import { authenticateAdminOrOwner } from "~/utils/auth";

import AdminLayout from "~/components/layouts/admin-layout";

const NewCategoryPage: FC = () => {
  return (
    <AdminLayout>
      <CategoryForm initialData={null} />
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default NewCategoryPage;
