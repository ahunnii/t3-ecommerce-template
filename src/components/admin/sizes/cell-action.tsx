"use client";
import axios from "axios";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter as useNavigationRouter, useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";

import { AlertModal } from "~/components/admin/modals/alert-modal";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import type { SizeColumn } from "~/components/admin/sizes/columns";

interface CellActionProps {
  data: SizeColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useNavigationRouter();
  const params = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { mutate: deleteSize } = api.sizes.deleteSize.useMutation({
    onSuccess: () => {
      router.refresh();
      router.push(`/admin/${params.query.storeId as string}/sizes`);
      toast.success("Size deleted.");
    },
    onError: (error) => {
      toast.error("Make sure you removed all products using this size first.");
      console.error(error);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      setLoading(false);
      setOpen(false);
    },
  });

  const onConfirm = async () => {
    deleteSize({
      storeId: params?.query?.storeId as string,
      sizeId: data.id,
    });
  };

  const onCopy = (id: string) => {
    navigator.clipboard
      .writeText(id)
      .then(() => {
        toast.success("Size ID copied to clipboard.");
      })
      .catch(() => {
        toast.error("Failed to copy size ID to clipboard.");
      });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
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
                `/admin/${params.query.storeId as string}/sizes/${data.id}`
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
