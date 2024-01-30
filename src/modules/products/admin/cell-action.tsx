import { Copy, Edit, Eye, MoreHorizontal, Trash } from "lucide-react";

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

import Link from "next/link";
import { toastService } from "~/services/toast";
import { api } from "~/utils/api";
import type { ProductColumn } from "./columns";

interface CellActionProps {
  data: ProductColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const params = useRouter();

  const apiContext = api.useContext();

  const { storeId } = params.query as { storeId: string };
  const productId = data.id;

  const baseUrl = `/admin/${storeId}/products/${productId}`;

  const { mutate: deleteProduct } = api.products.deleteProduct.useMutation({
    onSuccess: () => toastService.success("Product was successfully deleted"),
    onError: (error) =>
      toastService.error(
        "Make sure you removed all products using this collection first.",
        error
      ),
    onMutate: () => setLoading(true),
    onSettled: () => {
      void apiContext.products.invalidate();
      setLoading(false);
      setOpen(false);
    },
  });

  const onCopySelection = () => {
    navigator.clipboard
      .writeText(productId)
      .then(() => toastService.success("Collection ID copied to clipboard."))
      .catch((e) =>
        toastService.error("Failed to copy collection ID to clipboard.", e)
      );
  };

  const onConfirm = () => deleteProduct({ storeId, productId });
  const onDeleteSelection = () => setOpen(true);

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
