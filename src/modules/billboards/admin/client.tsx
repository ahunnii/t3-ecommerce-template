import { useRouter } from "next/router";

import { Plus } from "lucide-react";

import { ApiList } from "~/components/ui/api-list";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";

import Link from "next/link";

import { columns } from "./columns";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import type { BillboardColumn } from "../types";

type Props = { data: BillboardColumn[] };

export const BillboardClient: React.FC<Props> = ({ data }) => {
  const params = useRouter();
  const storeId = params.query.storeId as string;

  return (
    <>
      <div className="flex items-center justify-between">
        <TooltipProvider delayDuration={250}>
          <Tooltip>
            <TooltipTrigger className="text-left">
              <Heading
                title={`Billboards (${data.length})`}
                description="Manage billboards for your store. "
              />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-96">
                A billboard is a image text combo that can be used to promote a
                product or a category.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Link href={`/admin/${storeId}/billboards/new`}>
          <Button>
            <Plus className="h-4 w-4 lg:mr-2" />
            <span className="max-md:sr-only"> Add New</span>
          </Button>
        </Link>
      </div>
      <Separator />
      <DataTable searchKey="label" columns={columns} data={data} />
      <Heading title="Public API" description="API Calls for Billboards" />
      <Separator />
      <ApiList entityName="billboards" entityIdName="billboardId" />
    </>
  );
};
