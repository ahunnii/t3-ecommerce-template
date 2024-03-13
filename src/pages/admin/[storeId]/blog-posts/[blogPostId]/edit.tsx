import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import AdminLayout from "~/components/layouts/admin-layout";

import { BlogPostForm } from "~/modules/blog-posts/components/admin/blog-post-form";

interface IProps {
  storeId: string;
  blogPostId: string;
}

const EditBlogPostPage: FC<IProps> = ({ blogPostId }) => {
  const { data: blogPost, isLoading } = api.blogPosts.getBlogPost.useQuery({
    blogPostId,
  });

  return (
    <>
      <AdminLayout>
        {isLoading && <AbsolutePageLoader />}
        {!isLoading && blogPost && <BlogPostForm initialData={blogPost} />}
      </AdminLayout>
    </>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx, (ctx) => {
    return {
      props: {
        storeId: ctx.query.storeId,
        blogPostId: ctx.query.blogPostId,
      },
    };
  });
}

export default EditBlogPostPage;
