"use client";

import type { ColumnDef } from "@tanstack/react-table";

import Link from "next/link";
import { AdvancedDataTableColumnHeader } from "~/components/common/tables/advanced-data-table-header";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import type { BlogPostColumn } from "../../types";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<BlogPostColumn>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",

    header: ({ column }) => (
      <AdvancedDataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col items-start ">
        <Link
          href={`/admin/${row.original.storeId}/blog-posts/${row.original.id}`}
          className="text-sm font-medium text-gray-900"
        >
          <Button variant={"link"} className="mx-0 px-0">
            {row.original.title}
          </Button>
        </Link>
        <div className="text-sm text-gray-500">{row.original.id}</div>
      </div>
    ),
  },
  {
    accessorKey: "published",
    header: "Status",
    filterFn: (row, id, value) => {
      const key = row.getValue(id) ? "Published" : "Draft";
      return value.includes(key);
    },
    cell: ({ row }) => (row.original.published ? "Published" : "Draft"),
  },

  {
    accessorKey: "modifiedAt",
    header: ({ column }) => (
      <AdvancedDataTableColumnHeader column={column} title="Modified At" />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <AdvancedDataTableColumnHeader column={column} title="Created At" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
