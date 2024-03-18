import type { ColumnDef } from "@tanstack/react-table";

import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { AdminPreviewInStoreButton } from "~/components/common/admin/admin-preview-in-store-button";
import { Button } from "~/components/ui/button";
import type { CollectionColumn } from "../../types";
import { CollectionCellAction } from "./collection-cell-action";

export const collectionColumns: ColumnDef<CollectionColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="group flex w-full items-center gap-2">
        <div className="relative aspect-square h-10 rounded-lg border border-border shadow-sm">
          <Image
            src={row.original?.image?.url ?? "/placeholder-image.webp"}
            fill
            className="rounded-lg "
            alt=""
          />
        </div>
        <Link
          className="text-sm text-gray-500"
          href={`/admin/${row.original.storeId}/collections/${row.original.id}/edit`}
        >
          <Button variant={"link"} className="mx-0 px-0">
            {row.original.name}{" "}
          </Button>
        </Link>

        <AdminPreviewInStoreButton url={`/collections/${row.original.id}`} />
      </div>
    ),
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => <span> {row.original.products.length}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => format(row.original.createdAt, "MMMM do, yyyy"),
  },
  {
    id: "actions",
    cell: ({ row }) => <CollectionCellAction data={row.original} />,
  },
];
