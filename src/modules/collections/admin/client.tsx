import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";

import { Plus } from "lucide-react";

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

import type { CollectionColumn } from "../types";
import { columns } from "./columns";

type Props = { data: CollectionColumn[] };

export const CollectionsClient: React.FC<Props> = ({ data }) => {
  const params = useRouter();
  const navigate = useNavigationRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <TooltipProvider delayDuration={250}>
          <Tooltip>
            <TooltipTrigger className="text-left">
              <Heading
                title={`Collections (${data.length})`}
                description="Manage collections for your store. "
              />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-96">
                Collections are used to group products together. From basics
                like Apparel and Jewelry to more specific collections like
                Holiday and Sale.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button
          onClick={() =>
            navigate.push(
              `/admin/${params.query.storeId as string}/collections/new`
            )
          }
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="Public API" description="API Calls for Collections" />
      <Separator />
      <ApiList entityName="collections" entityIdName="categoryId" />
    </>
  );
};
