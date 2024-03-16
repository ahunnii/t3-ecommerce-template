import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";

import { authenticateAdminOrOwner } from "~/utils/auth";

import AdminLayout from "~/components/layouts/admin-layout";

import { BlogPostForm } from "~/modules/blog-posts/components/blog-post-form.admin";

interface IProps {
  storeId: string;
}

const NewBlogPostPage: FC<IProps> = () => {
  return (
    <AdminLayout>
      <BlogPostForm initialData={null} />
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default NewBlogPostPage;
