import Head from "next/head";
import Link from "next/link";

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

export const BlogHomePage = () => {
  const { data: blogs } = api.blogPosts.getAllBlogPosts.useQuery({});
  const config = useConfig();

  const items = blogs?.filter((blog) => blog.published) ?? [];
  const regex = /(<([^>]+)>)/gi;
  // const result = ;

  return (
    <StorefrontLayout {...config.layout} metadata={metadata}>
      <div className="space-y-10 py-10">
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <h3 className={cn(config.typography.h1)}>Blog</h3>
            <div className="flex w-full flex-col ">
              {items.map((item, idx) => (
                <div
                  className="w-full border border-black/10 bg-white p-4 even:bg-black/10"
                  key={idx}
                >
                  <p className={cn(config.typography.h3)}>{item.title}</p>
                  <p
                    className={cn(config.typography.p, "line-clamp-1 truncate")}
                  >
                    {item.content.replace(regex, "")}
                  </p>
                  <Link href={`/blog/${item.slug}`}>
                    <Button>Read More</Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
};
