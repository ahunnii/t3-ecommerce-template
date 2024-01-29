"use client";

import type { ColumnDef } from "@tanstack/react-table";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { CellAction } from "./cell-action";

export type GalleryImageColumn = {
  id: string;
  storeId: string;
  title?: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
};

export const columns: ColumnDef<GalleryImageColumn>[] = [
  {
    accessorKey: "name",
    header: "Image",
    cell: ({ row }) => (
      <div className="flex flex-col items-start ">
        <Link
          href={`/admin/${row.original.storeId}/gallery/${row.original.id}`}
          className="text-sm font-medium text-gray-900"
        >
          <Button variant={"link"} className="mx-0 px-0">
            {row.original?.title ?? row.original.url}
          </Button>
        </Link>
        <div className="text-sm text-gray-500">{row.original.id}</div>
      </div>
    ),
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
