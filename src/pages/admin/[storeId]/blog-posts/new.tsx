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
        <div className="flex-1  ">
          <BlogPostForm initialData={null} />
        </div>
      </div>
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default NewBlogPostPage;
