import parse from "html-react-parser";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";

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

              <Image
                src={blog?.featuredImg ?? ""}
                width={800}
                height={400}
                alt=""
              />
              <h1 className={cn(config.typography.h1)}>{blog?.title} </h1>
              <p className={cn(config.typography.subheader, "mt-0")}>
                {blog?.createdAt.toDateString()}
              </p>
              <div className={cn("", "")}>
                {parse(blog.content ?? "No description provided.")}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 px-4 sm:px-6 lg:px-8">
            {blog.tags.map((tag, idx) => (
              <span
                key={idx}
                className="rounded-md bg-gray-200 px-2 py-1 font-semibold text-gray-700"
              >
                {tag.name}
              </span>
            ))}
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
