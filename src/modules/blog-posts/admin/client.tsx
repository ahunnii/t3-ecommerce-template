"use client";

import { Plus } from "lucide-react";
import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";

import { ApiList } from "~/components/ui/api-list";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";

import { columns, type BlogPostColumn } from "./columns";

interface ProductsClientProps {
  data: BlogPostColumn[];
}

export const ProductsClient: React.FC<ProductsClientProps> = ({ data }) => {
  const params = useRouter();
  const router = useNavigationRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Blog Posts (${data.length})`}
          description="Manage your site's blog"
        />
        <Button
          onClick={() =>
            router.push(
              `/admin/${params.query.storeId as string}/blog-posts/new`
            )
          }
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Blog Posts" />
      <Separator />
      <ApiList entityName="blog-posts" entityIdName="blogPostId" />
    </>
  );
};
