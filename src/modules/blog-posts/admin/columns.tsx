"use client";

import type { ColumnDef } from "@tanstack/react-table";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import type { BlogPostColumn } from "../types";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<BlogPostColumn>[] = [
  {
    accessorKey: "name",
    header: "Title",
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
    header: "Published",
  },

  {
    accessorKey: "modifiedAt",
    header: "Modified at",
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
