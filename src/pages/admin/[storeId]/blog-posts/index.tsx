import { type FC } from "react";

import type { GetServerSidePropsContext } from "next";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import AdminLayout from "~/components/layouts/admin-layout";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import { BlogPostClient } from "~/modules/blog-posts/components/blog-post-client.admin";

interface IProps {
  storeId: string;
}

const BlogPostsPage: FC<IProps> = ({ storeId }) => {
  const { data: blogPosts, isLoading } = api.blogPosts.getAllBlogPosts.useQuery(
    {
      storeId,
    }
  );

  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}
      {!isLoading && <BlogPostClient data={blogPosts ?? []} />}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default BlogPostsPage;
