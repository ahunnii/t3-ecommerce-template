"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { ProductStatus } from "@prisma/client";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { CellAction } from "./cell-action";

export type ProductColumn = {
  id: string;
  storeId: string;
  name: string;
  price: number;
  category: {
    id: string;
    name: string;
  };
  updatedAt: Date;
  isFeatured: boolean;
  status: ProductStatus;
  variants: {
    id: string;
    names: string;
    price: number;
  }[];

  featuredImage?: string | null;
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
            href={`/admin/${row.original.storeId}/products/${row.original.id}/edit`}
            className="text-sm font-medium text-gray-900"
          >
            <Button variant={"link"} className="mx-0 px-0">
              {row.original.name}
            </Button>
          </Link>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: (row, id, value) => {
      const key = row.getValue(id);
      return value.includes(key);
    },
    cell: ({ row }) => row.original.status,
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },

  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const prices =
        row.original.variants?.length > 0
          ? row.original.variants.map((v) => v.price)
          : [row.original.price];
      const minPrice = Math.min(...prices);

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(minPrice);

      return (
        <div>
          {formatted} {prices?.length > 0 && "+"}
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Link
        href={`/admin/${row.original.storeId}/categories/${row.original.category.id}`}
        className="text-sm font-medium text-gray-900"
      >
        <Button variant={"link"} className="mx-0 px-0">
          {row.original.category.name}
        </Button>
      </Link>
    ),
  },

  {
    accessorKey: "updatedAt",
    header: "Last updated on",
    cell: ({ row }) => format(row.original.updatedAt, "MMMM do, yyyy"),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
