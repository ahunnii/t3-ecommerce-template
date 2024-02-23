import type { BlogPost } from "@prisma/client";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { useConfig } from "~/providers/style-config-provider";
import { cn } from "~/utils/styles";

export const BlogPostListing = ({ blog }: { blog: BlogPost }) => {
  const config = useConfig();
  const regex = /(<([^>]+)>)/gi;
  return (
    <article className="flex w-full flex-col space-y-5 border border-black/10 bg-white p-4 even:bg-black/10">
      <div>
        <p className={cn(config.typography.h3)}>{blog.title}</p>
        <p
          className={cn(
            config.typography.p,
            "line-clamp-1 truncate text-ellipsis"
          )}
        >
          {blog.content.replace(regex, "")}
        </p>
      </div>
      <Link href={`/blog/${blog.slug}`}>
        <Button>Read More</Button>
      </Link>
    </article>
  );
};
