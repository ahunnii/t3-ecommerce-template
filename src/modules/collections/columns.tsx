"use client";

import type { ColumnDef } from "@tanstack/react-table";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { CellAction } from "./cell-action";

export type CollectionColumn = {
  id: string;
  storeId: string;
  name: string;
  products: number;
  createdAt: string;
};

export const columns: ColumnDef<CollectionColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center">
        <Link
          className="text-sm text-gray-500"
          href={`/admin/${row.original.storeId}/collections/${row.original.id}`}
        >
          <Button variant={"link"} className="mx-0 px-0">
            {row.original.name}{" "}
          </Button>
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
