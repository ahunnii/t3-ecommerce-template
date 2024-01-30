import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";

import { authenticateAdminOrOwner } from "~/utils/auth";

import AdminLayout from "~/components/layouts/admin-layout";

import { BlogPostForm } from "~/modules/blog-posts/admin/blog-post-form";

interface IProps {
  storeId: string;
}

const NewBlogPostPage: FC<IProps> = () => {
  return (
    <AdminLayout>
      <div className="flex h-full flex-col bg-gray-50/25 dark:bg-slate-900">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <BlogPostForm initialData={null} />
        </div>
      </div>
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { store, user, redirect } = await authenticateAdminOrOwner(ctx);

  if (!store || !user) return { redirect };
  return {
    props: {},
  };
}

export default NewBlogPostPage;
