import type { ColumnDef } from "@tanstack/react-table";

import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import type { CategoryProductsColumn } from "../../types";

export const productColumn: ColumnDef<CategoryProductsColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex">
        <div className="h-8 w-8 flex-shrink-0">
          <Image
            className="h-8 w-8 rounded-md object-cover"
            src={row.original.featuredImage ?? "/placeholder-image.webp"}
            alt={row.original.name}
            height={40}
            width={40}
          />
        </div>
        <div className="ml-4">
          <Link
            href={`/admin/${row.original.storeId}/products/${row.original.id}`}
            target="_blank"
          >
            <Button variant={"link"} className="mx-0 px-0">
              {row.original.name}
            </Button>
          </Link>
        </div>
      </div>
    ),
  },
];
