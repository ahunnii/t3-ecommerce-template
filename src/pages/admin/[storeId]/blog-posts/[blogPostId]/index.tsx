import parse from "html-react-parser";
import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";
import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import AdminLayout from "~/components/layouts/admin-layout";
import PageLoader from "~/components/ui/page-loader";

import { Pencil } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ViewProductImages } from "~/modules/blog-posts/admin/view-product-images";
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
        {!blogPost && <div>Blog post not found</div>}
        {blogPost && (
          <div className="flex h-full flex-col bg-gray-50/25 dark:bg-slate-900">
            <div className="flex-1 space-y-4 p-8 pt-6">
              <section className="flex w-full gap-4 max-lg:flex-col">
                <div className="flex w-full flex-col space-y-4 lg:w-8/12">
                  <div className="flex justify-between">
                    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                      {blogPost.title}
                    </h1>
                    <Link
                      href={`/admin/${storeId}/blog-posts/${blogPost?.id}/edit`}
                    >
                      <Button className="flex gap-2">
                        {" "}
                        <Pencil className="h-5 w-5" />
                        Edit...
                      </Button>
                    </Link>
                  </div>

                  <div className="w-full rounded-md border border-border bg-background/50 p-4">
                    <div
                      className={cn("leading-7 [&:not(:first-child)]:mt-6", "")}
                    >
                      {parse(blogPost.content ?? "No content provided.")}
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-col lg:w-4/12">
                  <ViewProductImages {...blogPost} />
                </div>
              </section>
            </div>
          </div>
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

export default BlogPostPage;
