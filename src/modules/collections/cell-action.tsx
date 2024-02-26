import { useRouter } from "next/router";
import { useState } from "react";

import { Copy, Edit, Eye, MoreHorizontal, Trash } from "lucide-react";

import { AlertModal } from "~/components/admin/modals/alert-modal";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { api } from "~/utils/api";

import Link from "next/link";
import { toastService } from "~/services/toast";
import type { CollectionColumn } from "./columns";

interface CellActionProps {
  data: CollectionColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const params = useRouter();
  const apiContext = api.useContext();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { storeId } = params.query as { storeId: string };
  const collectionId = data.id;

  const baseUrl = `/admin/${storeId}/collections/${collectionId}`;

  const { mutate: deleteCollection } =
    api.collections.deleteCollection.useMutation({
      onSuccess: () =>
        toastService.success("Collection was successfully deleted"),
      onError: (error) =>
        toastService.error(
          "Make sure you removed all products using this collection first.",
          error
        ),
      onMutate: () => setLoading(true),
      onSettled: () => {
        void apiContext.collections.invalidate();
        setLoading(false);
        setOpen(false);
      },
    });

  const onCopySelection = () => {
    navigator.clipboard
      .writeText(collectionId)
      .then(() => toastService.success("Collection ID copied to clipboard."))
      .catch((e) =>
        toastService.error("Failed to copy collection ID to clipboard.", e)
      );
  };

  const onConfirm = () => deleteCollection({ collectionId });
  const onDeleteSelection = () => setOpen(true);

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
          <DropdownMenuItem onClick={onCopySelection}>
            <Copy className="mr-2 h-4 w-4" /> Copy Id
          </DropdownMenuItem>
          <Link href={baseUrl}>
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" /> View
            </DropdownMenuItem>
          </Link>
          <Link href={`${baseUrl}/edit`}>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" /> Update
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem onClick={onDeleteSelection}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
