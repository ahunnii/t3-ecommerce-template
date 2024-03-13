import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import { PageHeader } from "~/components/common/layout/page-header";

import StorefrontLayout from "~/components/layouts/storefront-layout";

import { BlogPostListing } from "~/modules/blog-posts/components/blog-post-listing";
import { useConfig } from "~/providers/style-config-provider";

import { api } from "~/utils/api";

const metadata = {
  title: "Blog | Trend Anomaly",
  description: "Home of all the latest Tend Anomaly news!",
};

const BlogHomePage = () => {
  const { data: blogs, isLoading } = api.blogPosts.getAllBlogPosts.useQuery({});
  const config = useConfig();

  const items = blogs?.filter((blog) => blog.published) ?? [];

  return (
    <StorefrontLayout {...config.layout} metadata={metadata}>
      <PageHeader>Blog</PageHeader>

      {isLoading && <AbsolutePageLoader />}

      {!isLoading && (
        <>
          <div className="flex w-full flex-col ">
            {items.map((item, idx) => (
              <BlogPostListing key={idx} blog={item} />
            ))}

            {(!items || items.length === 0) && (
              <p>
                There are no blog posts yet. Check back soon for the latest
                news!
              </p>
            )}
          </div>
        </>
      )}
    </StorefrontLayout>
  );
};

export default BlogHomePage;
