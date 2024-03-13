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
  const getAllBlogPosts = api.blogPosts.getAllBlogPosts.useQuery({
    published: true,
  });
  const config = useConfig();

  return (
    <StorefrontLayout {...config.layout} metadata={metadata}>
      <PageHeader>Blog</PageHeader>

      {getAllBlogPosts.isLoading && <AbsolutePageLoader />}

      {!getAllBlogPosts.isLoading && (
        <>
          <div className="flex w-full flex-col ">
            {getAllBlogPosts?.data?.map((item, idx) => (
              <BlogPostListing key={idx} blog={item} />
            ))}

            {(!getAllBlogPosts?.data || getAllBlogPosts?.data.length === 0) && (
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
