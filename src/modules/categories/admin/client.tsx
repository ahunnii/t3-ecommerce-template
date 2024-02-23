import { useRouter } from "next/router";

import { Plus } from "lucide-react";

import { ApiList } from "~/components/ui/api-list";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";

import Link from "next/link";
import { columns, type CategoryColumn } from "./columns";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

interface CategoriesClientProps {
  data: CategoryColumn[];
}

export const CategoriesClient: React.FC<CategoriesClientProps> = ({ data }) => {
  const params = useRouter();
  const storeId = params.query.storeId as string;

  return (
    <>
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
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="Public API" description="API Calls for Categories" />
      <Separator />
      <ApiList entityName="categories" entityIdName="categoryId" />
    </>
  );
};
