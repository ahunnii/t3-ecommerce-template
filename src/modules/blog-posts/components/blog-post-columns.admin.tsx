"use client";

import type { ColumnDef } from "@tanstack/react-table";

import Link from "next/link";
import { AdvancedDataTableColumnHeader } from "~/components/common/tables/advanced-data-table-header";

import { format } from "date-fns";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import type { BlogPostColumn } from "../types";
import { BlogPostCellAction } from "./blog-post-cell-action.admin";

export const blogPostColumns: ColumnDef<BlogPostColumn>[] = [
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
      <Link
        href={`/admin/${row.original.storeId}/blog-posts/${row.original.id}/edit`}
        className="text-sm font-medium text-gray-900"
      >
        <Button variant={"link"} className="mx-0 px-0">
          {row.original.title}
        </Button>
      </Link>
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
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <AdvancedDataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => format(row.original.updatedAt, "MMMM do, yyyy"),
  },

  {
    id: "actions",
    cell: ({ row }) => <BlogPostCellAction data={row.original} />,
  },
];
