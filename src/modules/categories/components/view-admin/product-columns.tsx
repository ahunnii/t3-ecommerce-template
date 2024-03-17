import type { ColumnDef } from "@tanstack/react-table";

import { Eye, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import type { CategoryProductsColumn } from "../../types";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export const productColumn: ColumnDef<CategoryProductsColumn>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="group flex">
        <div className="h-8 w-8 flex-shrink-0">
          <Image
            className="h-8 w-8 rounded-md object-cover"
            src={row.original.featuredImage ?? "/placeholder-image.webp"}
            alt={row.original.name}
            height={40}
            width={40}
          />
        </div>
        <div className=" ml-4 flex items-center gap-2">
          <Link
            href={`/admin/${row.original.storeId}/products/${row.original.id}/edit`}
            target="_blank"
          >
            <Button variant={"link"} className="mx-0 px-0">
              {row.original.name}
            </Button>
          </Link>

          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger>
                <Link href={`/product/${row.original.id}`} target="_blank">
                  <Button
                    className="m-0 hidden h-6 w-6  rounded-full p-0 hover:text-blue-600 group-hover:flex"
                    variant={"ghost"}
                  >
                    <Eye className=" size-4 " />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Preview in Store</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    ),
  },
];
