"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type CollectionColumn = {
  id: string;
  name: string;
  products: number;
  createdAt: string;
};

export const columns: ColumnDef<CollectionColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
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
