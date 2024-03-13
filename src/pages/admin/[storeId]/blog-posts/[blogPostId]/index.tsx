import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";
import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import AdminLayout from "~/components/layouts/admin-layout";
import PageLoader from "~/components/ui/page-loader";

import { Eye, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AdminFormHeader } from "~/components/common/admin/admin-form-header";
import { PageHeader } from "~/components/common/layout/page-header";
import { Button } from "~/components/ui/button";

import dynamic from "next/dynamic";

import { AdminFormBody } from "~/components/common/admin/admin-form-body";
import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import { BlogPostTagsSection } from "~/modules/blog-posts/components/blog-post-tags.section";
import { cn } from "~/utils/styles";

interface IProps {
  storeId: string;
  blogPostId: string;
}

const BlogPostPage: FC<IProps> = ({ storeId, blogPostId }) => {
  const { data: blogPost, isLoading } = api.blogPosts.getBlogPost.useQuery({
    blogPostId,
  });

  return (
    <>
      <AdminLayout>
        {isLoading && <PageLoader />}

        {!isLoading && blogPost && (
          <>
            <AdminFormHeader
              title={blogPost.title}
              description={
                "View how your blog post will appear to your customers."
              }
              contentName="Blog Posts"
              link={`/admin/${storeId}/blog-posts`}
            >
              <Link href={`/blog/${blogPost?.slug}`} target="_blank">
                <Button className="flex gap-2" variant={"outline"}>
                  <Eye className="h-5 w-5" />
                  View on Site
                </Button>
              </Link>

              <Link href={`/admin/${storeId}/blog-posts/${blogPost?.id}/edit`}>
                <Button className="flex gap-2">
                  <Pencil className="h-5 w-5" />
                  Edit...
                </Button>
              </Link>
            </AdminFormHeader>

            <AdminFormBody className="flex-col ">
              <PageHeader>
                {blogPost?.title ?? "Blog Post Not Found"}{" "}
              </PageHeader>

              <p className={cn("text-sm text-muted-foreground", "mt-0")}>
                {blogPost?.createdAt.toDateString()}
              </p>

              {blogPost?.featuredImg && (
                <Image
                  src={blogPost?.featuredImg ?? "/placeholder-image.webp"}
                  width={800}
                  height={400}
                  alt=""
                />
              )}

              <LazyBlogPostContentSection content={blogPost.content} />
              <BlogPostTagsSection tags={blogPost.tags} />
            </AdminFormBody>
          </>
        )}

        {!isLoading && !blogPost && (
          <DataFetchErrorMessage message="There seems to be an issue with loading the blog post" />
        )}
      </AdminLayout>
    </>
  );
};

const LazyBlogPostContentSection = dynamic(
  () =>
    import("~/modules/blog-posts/components/blog-post-content.section").then(
      (mod) => mod.BlogPostContentSection
    ),
  { ssr: false }
);

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

export default BlogPostPage;
