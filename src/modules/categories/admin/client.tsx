import { useRouter } from "next/router";

import { Plus } from "lucide-react";

import { ApiList } from "~/components/ui/api-list";
import { Button } from "~/components/ui/button";

import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";

import Link from "next/link";
import { columns } from "./columns";

import { AdvancedDataTable } from "~/components/common/tables/advanced-data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import type { CategoryColumn } from "../types";

type Props = { data: CategoryColumn[] };

export const CategoriesClient: React.FC<Props> = ({ data }) => {
  const params = useRouter();
  const storeId = params.query.storeId as string;

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <TooltipProvider delayDuration={250}>
          <Tooltip>
            <TooltipTrigger className="text-left">
              <Heading
                title={`Categories (${data.length})`}
                description="Manage categories for your store."
              />{" "}
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-96">
                Products are assigned a category, which includes shared
                attributes that can used to generate product variants.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Link href={`/admin/${storeId}/categories/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </Link>
      </div>
      <Separator />
      <AdvancedDataTable searchKey="name" columns={columns} data={data} />
      <Heading title="Public API" description="API Calls for Categories" />
      <Separator />
      <ApiList entityName="categories" entityIdName="categoryId" />
    </div>
  );
};
