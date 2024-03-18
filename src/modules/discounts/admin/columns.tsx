"use client";

import type { ColumnDef } from "@tanstack/react-table";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import type { DiscountColumn } from "../types";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<DiscountColumn>[] = [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <div className="flex flex-col items-start ">
        <Link
          href={`/admin/${row.original.storeId}/discounts/${row.original.id}/edit`}
          className="text-sm font-medium text-gray-900"
        >
          <Button variant={"link"} className="mx-0 px-0">
            {row.original.code}
          </Button>
        </Link>
        <div className="text-sm text-gray-500">{row.original.id}</div>
      </div>
    ),
  },
  {
    accessorKey: "active",
    header: "Active",
  },

  {
    accessorKey: "updatedAt",
    header: "Updated at",
    cell: ({ row }) => (
      <div className="text-sm text-gray-500">
        {row.original.updatedAt.toDateString()}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row }) => (
      <div className="text-sm text-gray-500">
        {row.original.createdAt.toDateString()}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
