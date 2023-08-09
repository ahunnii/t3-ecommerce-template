"use client";

import { Plus } from "lucide-react";
import { useRouter as useNavigationRouter, useParams } from "next/navigation";

import { useRouter } from "next/router";
import { ApiList } from "~/components/ui/api-list";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";

import { columns, type SizeColumn } from "~/components/admin/sizes/columns";

interface SizesClientProps {
  data: SizeColumn[];
}

export const SizesClient: React.FC<SizesClientProps> = ({ data }) => {
  const params = useRouter();
  const navigate = useNavigationRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes (${data.length})`}
          description="Manage sizes for your products"
        />
        <Button
          onClick={() =>
            navigate.push(`/admin/${params.query.storeId as string}/sizes/new`)
          }
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Sizes" />
      <Separator />
      <ApiList entityName="sizes" entityIdName="sizeId" />
    </>
  );
};
