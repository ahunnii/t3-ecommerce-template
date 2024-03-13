"use client";

import { Plus } from "lucide-react";

import { useRouter } from "next/router";

import { ApiList } from "~/components/ui/api-list";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import Link from "next/link";
import { AdvancedDataTable } from "~/components/common/tables/advanced-data-table";
import type { BlogPostColumn } from "../types";
import { columns } from "./columns";
import { filterOptions } from "./filter-options";

type Props = { data: BlogPostColumn[] };

export const BlogPostClient: React.FC<Props> = ({ data }) => {
  const params = useRouter();
  const storeId = params.query.storeId as string;

  return (
    <>
      <div className="flex items-center justify-between">
        <TooltipProvider delayDuration={250}>
          <Tooltip>
            <TooltipTrigger className="text-left">
              <Heading
                title={`Blog Posts (${data.length})`}
                description="Manage your site's blog"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-96">
                Blog posts are a great way to keep your customers informed about
                new products, sales, and other news.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Link href={`/admin/${storeId}/blog-posts/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </Link>
      </div>
      <Separator />
      <AdvancedDataTable
        searchKey="name"
        columns={columns}
        data={data}
        filters={filterOptions}
      />
      <Heading title="API" description="API Calls for Blog Posts" />
      <Separator />
      <ApiList entityName="blog-posts" entityIdName="blogPostId" />
    </>
  );
};
