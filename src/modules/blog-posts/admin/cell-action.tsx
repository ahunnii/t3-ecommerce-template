"use client";

import axios from "axios";
import { Copy, Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { AlertModal } from "~/components/admin/modals/alert-modal";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import type { BlogPostColumn } from "./columns";

interface CellActionProps {
  data: BlogPostColumn;
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
        `/api/${params.query.storeId as string}/blog-posts/${data.id}`
      );
      toast.success("Blog post deleted.");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onCopy = (id: string) => {
    navigator.clipboard
      .writeText(id)
      .then(() => {
        toast.success("Blog post ID copied to clipboard.");
      })
      .catch(() => {
        toast.error("Failed to copy Blog post ID to clipboard.");
      });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
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
                `/admin/${params.query.storeId as string}/blog-posts/${data.id}`
              )
            }
          >
            <Eye className="mr-2 h-4 w-4" /> View
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(
                `/admin/${params.query.storeId as string}/blog-posts/${
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
