import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";

import { Plus } from "lucide-react";

import { ApiList } from "~/components/ui/api-list";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import { AdvancedDataTable } from "~/components/common/tables/advanced-data-table";
import type { CollectionColumn } from "../../types";
import { collectionColumns } from "./collection-columns";

type Props = { data: CollectionColumn[] };

export const CollectionsClient: React.FC<Props> = ({ data }) => {
  const params = useRouter();
  const navigate = useNavigationRouter();

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-8">
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
      <AdvancedDataTable
        searchKey="name"
        columns={collectionColumns}
        data={data}
      />
      <Heading title="Public API" description="API Calls for Collections" />
      <Separator />
      <ApiList entityName="collections" entityIdName="categoryId" />
    </div>
  );
};
