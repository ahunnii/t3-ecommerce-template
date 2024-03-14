import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";

import { authenticateAdminOrOwner } from "~/utils/auth";

import AdminLayout from "~/components/layouts/admin-layout";

import { DiscountForm } from "~/modules/discounts/admin/discount-form";

interface IProps {
  storeId: string;
}

const NewBlogPostPage: FC<IProps> = () => {
  return (
    <AdminLayout>
      <DiscountForm initialData={null} />
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default NewBlogPostPage;
