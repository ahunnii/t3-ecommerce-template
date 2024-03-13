import dynamic from "next/dynamic";

import Image from "next/image";

import { useParams } from "next/navigation";
import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import { PageHeader } from "~/components/common/layout/page-header";
import { TaBreadCrumbs } from "~/components/custom/ta-breadcrumbs.custom";

import StorefrontLayout from "~/components/layouts/storefront-layout";
import { BlogPostTagsSection } from "~/modules/blog-posts/components/blog-post-tags.section";

import { useConfig } from "~/providers/style-config-provider";

import { api } from "~/utils/api";
import { cn } from "~/utils/styles";

const metadata = {
  title: "Blog | Trend Anomaly",
  description: "Home of all the latest Tend Anomaly news!",
};

const BlogPostPage = () => {
  const params = useParams();
  const { data: blog, isLoading } = api.blogPosts.getBlogPost.useQuery(
    {
      slug: params?.blogPostSlug as string,
    },
    {
      enabled: !!params?.blogPostSlug,
    }
  );
  const config = useConfig();

  return (
    <StorefrontLayout {...config.layout} metadata={metadata}>
      {isLoading && <AbsolutePageLoader />}

      {!isLoading && (
        <>
          <TaBreadCrumbs
            pathway={[
              { name: "Blog", link: "/blog" },
              blog ? { name: blog.title } : { name: "404" },
            ]}
          />
          <PageHeader>{blog?.title ?? "Blog Post Not Found"} </PageHeader>
          {blog && (
            <>
              {blog?.featuredImg && (
                <Image
                  src={blog?.featuredImg ?? "/placeholder-image.webp"}
                  width={800}
                  height={400}
                  alt=""
                />
              )}

              <p className={cn(config.typography.subheader, "mt-0")}>
                {blog?.createdAt.toDateString()}
              </p>

              <LazyBlogPostContentSection content={blog.content} />

              <BlogPostTagsSection tags={blog.tags} />
            </>
          )}

          {!blog && (
            <p>
              The blog post you are looking for does not exist. Please try
              again.
            </p>
          )}
        </>
      )}
    </StorefrontLayout>
  );
};

const LazyBlogPostContentSection = dynamic(
  () =>
    import("~/modules/blog-posts/components/blog-post-content.section").then(
      (mod) => mod.BlogPostContentSection
    ),
  { loading: () => <AbsolutePageLoader /> }
);

export default BlogPostPage;
