import { format } from "date-fns";
import { useCallback, useEffect, useState, type FC } from "react";

import type { GetServerSidePropsContext } from "next";
import type { BlogPostColumn } from "~/modules/blog-posts/admin/columns";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import AdminLayout from "~/components/layouts/admin-layout";
import PageLoader from "~/components/ui/page-loader";
import { ProductsClient } from "~/modules/blog-posts/admin/client";
import type { BlogPost } from "~/modules/blog-posts/types";

interface IProps {
  storeId: string;
}

const ProductsPage: FC<IProps> = ({ storeId }) => {
  const [formattedBlogPosts, setFormattedBlogPosts] = useState<
    BlogPostColumn[]
  >([]);
  const { data: blogPosts } = api.blogPosts.getAllBlogPosts.useQuery({
    storeId,
  });

  const formatBlogPosts = useCallback((products: BlogPost[]) => {
    return products.map((item: BlogPost) => ({
      id: item.id,
      storeId: item.storeId,
      title: item.title,
      published: item.published,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
      updatedAt: format(item.updatedAt, "MMMM do, yyyy"),
    }));
  }, []);

  useEffect(() => {
    if (blogPosts)
      setFormattedBlogPosts(formatBlogPosts(blogPosts as BlogPost[]));
  }, [blogPosts, formatBlogPosts]);

  return (
    <AdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {!blogPosts && <PageLoader />}
          {blogPosts && <ProductsClient data={formattedBlogPosts} />}
        </div>
      </div>
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default ProductsPage;
