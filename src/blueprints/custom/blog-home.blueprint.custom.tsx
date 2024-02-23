import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";

import StorefrontLayout from "~/components/layouts/storefront-layout";

import { BlogPostListing } from "~/modules/blog-posts/components/blog-post-listing";
import { useConfig } from "~/providers/style-config-provider";

import { api } from "~/utils/api";
import { cn } from "~/utils/styles";

const metadata = {
  title: "Blog | Trend Anomaly",
  description: "Home of all the latest Tend Anomaly news!",
};

export const BlogHomePage = () => {
  const { data: blogs, isLoading } = api.blogPosts.getAllBlogPosts.useQuery({});
  const config = useConfig();

  const items = blogs?.filter((blog) => blog.published) ?? [];

  return (
    <StorefrontLayout {...config.layout} metadata={metadata}>
      {isLoading && <AbsolutePageLoader />}
      <div className="space-y-10 py-10">
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <h3 className={cn(config.typography.h1)}>Blog</h3>
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
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
};
