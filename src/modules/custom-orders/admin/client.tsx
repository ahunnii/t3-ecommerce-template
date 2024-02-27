import { useRouter } from "next/router";

import { Plus } from "lucide-react";

import { ApiList } from "~/components/ui/api-list";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";

import Link from "next/link";

import { columns, type CustomOrderColumn } from "./columns";

interface BillboardClientProps {
  data: CustomOrderColumn[];
}

export const CustomOrderClient: React.FC<BillboardClientProps> = ({ data }) => {
  const params = useRouter();
  const storeId = params.query.storeId as string;

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Custom Order Requests (${data.length})`}
          description="Manage custom requests for your store."
        />
        <Link href={`/admin/${storeId}/custom-orders/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </Link>
      </div>
      <Separator />
      <DataTable searchKey="email" columns={columns} data={data} />
      {/* <Heading title="Public API" description="API Calls for Billboards" /> */}
      {/* <Separator /> */}
      {/* <ApiList entityName="billboards" entityIdName="billboardId" /> */}
    </>
  );
};
