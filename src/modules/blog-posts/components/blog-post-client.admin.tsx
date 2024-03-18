"use client";

import { Plus } from "lucide-react";

import { useRouter } from "next/router";

import { ApiList } from "~/components/ui/api-list";
import { Button } from "~/components/ui/button";

import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";

import Link from "next/link";
import { AdminClientHeading } from "~/components/common/admin/admin-client-heading";
import { AdvancedDataTable } from "~/components/common/tables/advanced-data-table";
import type { BlogPostColumn } from "../types";
import { blogPostColumns } from "./blog-post-columns.admin";
import { blogPostFilterOptions } from "./blog-post-filter-options.admin";

type Props = { data: BlogPostColumn[] };

export const BlogPostClient: React.FC<Props> = ({ data }) => {
  const params = useRouter();
  const storeId = params.query.storeId as string;

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-8">
      <div className="flex items-center justify-between">
        <AdminClientHeading
          title={`Blog Posts (${data.length})`}
          description="Manage your site's blog"
          isTooltip
          tooltipContent="Blog posts are a great way to keep your customers informed about new products, sales, and other news."
        />

        <Link href={`/admin/${storeId}/blog-posts/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </Link>
      </div>
      <Separator />
      <AdvancedDataTable
        searchKey="name"
        columns={blogPostColumns}
        data={data}
        filters={blogPostFilterOptions}
      />
      <Heading title="API" description="API Calls for Blog Posts" />
      <Separator />
      <ApiList entityName="blog-posts" entityIdName="blogPostId" />
    </div>
  );
};
