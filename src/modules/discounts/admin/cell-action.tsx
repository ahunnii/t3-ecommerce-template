"use client";

import axios from "axios";
import { Copy, Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";

import { AlertModal } from "~/components/admin/modals/alert-modal";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { toastService } from "~/services/toast";
import type { DiscountColumn } from "../types";

interface CellActionProps {
  data: DiscountColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useNavigationRouter();
  const params = useRouter();

  const onConfirm = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.query.storeId as string}/discounts/${data.id}`
      );
      toastService.success("Blog post deleted.");
      router.refresh();
    } catch (error: unknown) {
      toastService.error("Something went wrong", error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onCopy = (id: string) => {
    navigator.clipboard
      .writeText(id)
      .then(() => toastService.success("Blog post ID copied to clipboard."))
      .catch((err: unknown) =>
        toastService.error("Failed to copy Blog post ID to clipboard.", err)
      );
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        setIsOpen={setOpen}
        onConfirm={() => void onConfirm()}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" /> Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(
                `/admin/${params.query.storeId as string}/discounts/${data.id}`
              )
            }
          >
            <Eye className="mr-2 h-4 w-4" /> View
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(
                `/admin/${params.query.storeId as string}/discounts/${
                  data.id
                }/edit`
              )
            }
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
