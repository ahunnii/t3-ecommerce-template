"use client";

import { CloudLightning, Edit, Eye, MoreHorizontal, Trash } from "lucide-react";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { AlertModal } from "~/modules/admin/components/modals/alert-modal";

import Link from "next/link";
import { IdCopyMenuItem } from "~/components/common/dropdown/id-copy-menu-item";
import { toastService } from "~/services/toast";
import { api } from "~/utils/api";
import type { BlogPostColumn } from "../types";

type Props = { data: BlogPostColumn };

export const BlogPostCellAction: React.FC<Props> = ({ data }) => {
  const [open, setOpen] = useState(false);

  const params = useRouter();
  const apiContext = api.useContext();
  const { storeId } = params.query as { storeId: string };
  const blogPostId = data.id;

  const baseUrl = `/admin/${storeId}/blog-posts/${blogPostId}`;
  const storePreviewUrl = `/blog/${data.slug}`;

  const deleteBlogPost = api.blogPosts.deleteBlogPost.useMutation({
    onSuccess: () => toastService.success("Blog post deleted."),
    onError: (error: unknown) => {
      toastService.error(
        "There was an issue deleting the blog post. Please try again.",
        error
      );
    },
    onSettled: () => {
      void apiContext.blogPosts.invalidate();
      setOpen(false);
    },
  });

  const onConfirm = () => deleteBlogPost.mutate({ blogPostId });
  const onDeleteSelection = () => setOpen(true);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 500);
    }
  }, [open]);
  return (
    <>
      <AlertModal
        isOpen={open}
        setIsOpen={setOpen}
        onConfirm={onConfirm}
        loading={deleteBlogPost.isLoading}
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
          <IdCopyMenuItem id={blogPostId} name="Blog Post ID" />
          <Link href={storePreviewUrl} target="_blank">
            <DropdownMenuItem className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" /> Preview in Store
            </DropdownMenuItem>
          </Link>{" "}
          <Link href={baseUrl}>
            <DropdownMenuItem className="cursor-pointer">
              <CloudLightning className="mr-2 h-4 w-4" /> Quick View
            </DropdownMenuItem>
          </Link>
          <Link href={`${baseUrl}/edit`}>
            <DropdownMenuItem className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" /> Update
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            onClick={onDeleteSelection}
            className="cursor-pointer  "
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
