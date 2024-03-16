import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import AdminLayout from "~/components/layouts/admin-layout";

import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import { BlogPostForm } from "~/modules/blog-posts/components/blog-post-form.admin";

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
        {!isLoading && !blogPost && (
          <DataFetchErrorMessage message="There seems to be an issue with loading the blog post." />
        )}
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
