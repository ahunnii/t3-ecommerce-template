import parse from "html-react-parser";
import { ArrowLeft } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";
import GalleryCard from "~/components/core/ui/gallery-card";
import StorefrontLayout from "~/components/layouts/storefront-layout";
import { Button } from "~/components/ui/button";
import { useConfig } from "~/providers/style-config-provider";

import { api } from "~/utils/api";
import { cn } from "~/utils/styles";

const metadata = {
  title: "Blog | Trend Anomaly",
  description: "Home of all the latest Tend Anomaly news!",
};

export const BlogPostPage = () => {
  const params = useParams();
  const { data: blog, isLoading } = api.blogPosts.getBlogPost.useQuery({
    slug: params?.blogPostSlug as string,
  });
  const config = useConfig();
  console.log(params);
  // const result = ;

  return (
    <StorefrontLayout {...config.layout} metadata={metadata}>
      {isLoading && <AbsolutePageLoader />}

      {!isLoading && blog && (
        <div className="space-y-10 py-10">
          <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              <Link href={`/blog`}>
                <Button
                  variant={"link"}
                  className={
                    "mx-0 flex items-center gap-x-2 px-0 text-purple-800"
                  }
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back to Blog
                </Button>
              </Link>
              <h3 className="text-3xl font-bold">{blog?.title} </h3>

              <div className={cn("", "")}>
                {parse(blog.content ?? "No description provided.")}
              </div>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !blog && (
        <div className="space-y-10 py-10">
          <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold">Blog Post Not Found</h3>
              <p>
                The blog post you are looking for does not exist. Please try
                again.
              </p>
            </div>
          </div>
        </div>
      )}
    </StorefrontLayout>
  );
};
