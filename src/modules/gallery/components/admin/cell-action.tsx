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

import Link from "next/link";
import { toastService } from "~/services/toast";
import { api } from "~/utils/api";
import type { GalleryImageColumn } from "./columns";

interface CellActionProps {
  data: GalleryImageColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const router = useNavigationRouter();
  const params = useRouter();

  const apiContext = api.useContext();

  const { storeId } = params.query as { storeId: string };
  const galleryId = data.id;

  const baseUrl = `/admin/${storeId}/gallery/${galleryId}`;

  const { mutate: deleteGalleryImage } =
    api.gallery.deleteGalleryImage.useMutation({
      onSuccess: () =>
        toastService.success("Gallery image was successfully deleted"),
      onError: (error) =>
        toastService.error(
          "There was an issue with deleting your gallery image",
          error
        ),
      onMutate: () => setLoading(true),
      onSettled: () => {
        void apiContext.gallery.invalidate();
        setLoading(false);
        setOpen(false);
      },
    });
  const onCopySelection = () => {
    navigator.clipboard
      .writeText(galleryId)
      .then(() => toastService.success("Gallery ID copied to clipboard."))
      .catch((e) =>
        toastService.error("Failed to copy gallery ID to clipboard.", e)
      );
  };

  const onConfirm = () => deleteGalleryImage({ id: galleryId });
  const onDeleteSelection = () => setOpen(true);

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
