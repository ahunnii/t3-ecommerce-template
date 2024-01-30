import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { Copy, Edit, Eye, MoreHorizontal, Trash } from "lucide-react";

import { AlertModal } from "~/components/admin/modals/alert-modal";
import { Button } from "~/components/ui/button";
import * as Dropdown from "~/components/ui/dropdown-menu";

import { api } from "~/utils/api";

import { toastService } from "~/services/toast";
import type { BillboardColumn } from "./columns";

interface CellActionProps {
  data: BillboardColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);

  const params = useRouter();
  const apiContext = api.useContext();
  const { storeId } = params.query as { storeId: string };
  const billboardId = data.id;

  const baseUrl = `/admin/${storeId}/billboards/${billboardId}`;

  const { mutate: deleteBillboard, isLoading } =
    api.billboards.deleteBillboard.useMutation({
      onSuccess: () => toastService.success("Billboard deleted."),
      onError: (error: unknown) => {
        toastService.error(
          "Make sure you removed all items using this billboard first.",
          error
        );
      },
      onSettled: () => {
        void apiContext.billboards.invalidate();
        setOpen(false);
      },
    });

  const onConfirm = () => deleteBillboard({ storeId, billboardId });
  const onDeleteSelection = () => setOpen(true);

  const onCopySelection = () => {
    navigator.clipboard
      .writeText(billboardId)
      .then(() => toastService.success("Billboard ID copied to clipboard."))
      .catch((e) =>
        toastService.error("Failed to copy billboard ID to clipboard.", e)
      );
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={isLoading}
      />
      <Dropdown.DropdownMenu>
        <Dropdown.DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </Dropdown.DropdownMenuTrigger>
        <Dropdown.DropdownMenuContent align="end">
          <Dropdown.DropdownMenuLabel>Actions</Dropdown.DropdownMenuLabel>
          <Dropdown.DropdownMenuItem
            onClick={onCopySelection}
            className="cursor-pointer"
          >
            <Copy className="mr-2 h-4 w-4" /> Copy Id
          </Dropdown.DropdownMenuItem>
          <Link href={baseUrl}>
            <Dropdown.DropdownMenuItem className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" /> View
            </Dropdown.DropdownMenuItem>
          </Link>
          <Link href={`${baseUrl}/edit`}>
            <Dropdown.DropdownMenuItem className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" /> Update
            </Dropdown.DropdownMenuItem>
          </Link>
          <Dropdown.DropdownMenuItem
            onClick={onDeleteSelection}
            className="cursor-pointer"
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </Dropdown.DropdownMenuItem>
        </Dropdown.DropdownMenuContent>
      </Dropdown.DropdownMenu>
    </>
  );
};
