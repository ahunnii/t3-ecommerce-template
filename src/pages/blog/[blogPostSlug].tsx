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
  const slug = params?.blogPostSlug as string;
  const getBlogPost = api.blogPosts.getBlogPost.useQuery(
    { slug },
    { enabled: !!slug }
  );
  const config = useConfig();

  return (
    <StorefrontLayout {...config.layout} metadata={metadata}>
      {getBlogPost.isLoading && <AbsolutePageLoader />}

      {!getBlogPost.isLoading && (
        <>
          <TaBreadCrumbs
            pathway={[
              { name: "Blog", link: "/blog" },
              getBlogPost.data
                ? { name: getBlogPost.data.title }
                : { name: "404" },
            ]}
          />
          <PageHeader>
            {getBlogPost.data?.title ?? "Blog Post Not Found"}{" "}
          </PageHeader>
          {getBlogPost.data && (
            <>
              {getBlogPost.data?.featuredImg && (
                <Image
                  src={
                    getBlogPost.data?.featuredImg ?? "/placeholder-image.webp"
                  }
                  width={800}
                  height={400}
                  alt=""
                />
              )}

              <p className={cn(config.typography.subheader, "mt-0")}>
                {getBlogPost.data?.createdAt.toDateString()}
              </p>

              <LazyBlogPostContentSection content={getBlogPost.data.content} />

              <BlogPostTagsSection tags={getBlogPost.data.tags} />
            </>
          )}

          {!getBlogPost.data && (
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
    import("~/modules/blog-posts/components/view-blog-post-content.admin").then(
      (mod) => mod.BlogPostContentSection
    ),
  { loading: () => <AbsolutePageLoader /> }
);

export default BlogPostPage;
