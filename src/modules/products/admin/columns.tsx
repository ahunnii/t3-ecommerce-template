"use client";

import type { ColumnDef } from "@tanstack/react-table";

import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { CellAction } from "./cell-action";

export type ProductColumn = {
  id: string;
  storeId: string;
  name: string;
  price: string;
  category: string;

  createdAt: string;
  isFeatured: boolean;
  isArchived: boolean;
  featuredImage?: string | null;
  images?: string[] | null;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => (
      <div className="flex items-center">
        <div className="h-10 w-10 flex-shrink-0">
          <Image
            className="h-10 w-10 rounded-md object-cover"
            src={row.original.featuredImage ?? "/placeholder-image.webp"}
            alt={row.original.name}
            height={40}
            width={40}
          />
        </div>
        <div className="ml-4">
          <Link
            href={`/admin/${row.original.storeId}/products/${row.original.id}`}
            className="text-sm font-medium text-gray-900"
          >
            <Button variant={"link"} className="mx-0 px-0">
              {row.original.name}
            </Button>
          </Link>
          <div className="text-sm text-gray-500">{row.original.id}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
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
