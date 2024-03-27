import type { ColumnDef } from "@tanstack/react-table";

import { format } from "date-fns";
import Link from "next/link";
import { AdminPreviewInStoreButton } from "~/components/common/admin/admin-preview-in-store-button";
import { Button } from "~/components/ui/button";
import { env } from "~/env.mjs";
import type { ContentColumn } from "../../types";
// import { CategoryCellAction } from "./category-cell-action.admin";

export const contentColumns: ColumnDef<ContentColumn>[] = [
  {
    accessorKey: "title",
    header: "Page Title",
    cell: ({ row }) => (
      <div className="group flex items-center gap-2">
        <Link
          href={`/admin/${env.NEXT_PUBLIC_STORE_ID}/content/${row.original.slug}`}
        >
          <Button variant={"link"} className="mx-0 px-0">
            {row.original.title}
          </Button>
        </Link>

        {/* {row.original.collection?.id && (
          <AdminPreviewInStoreButton
            url={`/collections/${row.original.collection?.id}`}
          />
        )} */}
      </div>
    ),
  },

  {
    accessorKey: "updatedAt",
    header: "Last updated at",
    cell: ({ row }) =>
      format(new Date(row.original.updatedAt), "MMMM do, yyyy"),
  },

  // {
  //   id: "actions",

  //   cell: ({ row }) => <CategoryCellAction data={row.original} />,
  // },
];
