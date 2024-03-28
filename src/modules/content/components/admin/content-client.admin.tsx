import { useRouter } from "next/router";

import { Plus } from "lucide-react";

import { ApiList } from "~/components/ui/api-list";
import { Button } from "~/components/ui/button";

import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";

import Link from "next/link";
import { contentColumns } from "./content-columns.admin";

import { AdvancedDataTable } from "~/components/common/tables/advanced-data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import type { ContentColumn } from "../../types";

type Props = { data: ContentColumn[] };

export const ContentClient: React.FC<Props> = ({ data }) => {
  const params = useRouter();
  const storeId = params.query.storeId as string;

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-8">
      <div className="flex items-center justify-between">
        <TooltipProvider delayDuration={250}>
          <Tooltip>
            <TooltipTrigger className="text-left">
              <Heading
                title={`Content Pages (${data.length})`}
                description="Manage misc pages for your store."
              />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-96">
                Content is primarily managed through your headless CMS.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Link href={`/admin/${storeId}/content/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </Link>
      </div>
      <Separator />
      <AdvancedDataTable
        searchKey="title"
        columns={contentColumns}
        data={data}
      />
      {/* <Heading title="Public API" description="API Calls for Categories" />
      <Separator />
      <ApiList entityName="content" entityIdName="categoryId" /> */}
    </div>
  );
};
