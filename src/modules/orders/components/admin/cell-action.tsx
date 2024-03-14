"use client";

import {
  CheckSquareIcon,
  Copy,
  Download,
  Edit,
  Eye,
  MoreHorizontal,
  Package,
  Trash,
} from "lucide-react";
import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { AlertModal } from "~/components/admin/modals/alert-modal";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { useShippingModal } from "~/modules/shipping/hooks/use-shipping-modal";
import { toastService } from "~/services/toast";
import { api } from "~/utils/api";
import type { OrderColumn } from "./columns";

interface CellActionProps {
  data: OrderColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useNavigationRouter();
  const shippingModal = useShippingModal();
  const params = useRouter();
  const apiContext = api.useContext();
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const deleteOrder = api.orders.deleteOrder.useMutation({
    onSuccess: () => {
      router.refresh();
      toastService.success("Order successfully deleted");
    },
    onError: (error) => toastService.error("Failed to delete order", error),
    onSettled: () => {
      setOpen(false);
      void apiContext.orders.invalidate();
    },
  });

  const updateShippingStatus = api.orders.updateOrderShipStatus.useMutation({
    onSuccess: () => {
      toastService.success("Order marked as shipped");
    },
    onError: (error) =>
      toastService.error("Failed to update order shipping status", error),
    onSettled: () => {
      void apiContext.orders.invalidate();
    },
  });

  const onConfirm = () => {
    deleteOrder.mutate({
      orderId: data.id,
    });
  };

  const onCopy = (id: string) => {
    navigator.clipboard
      .writeText(id)
      .then(() => toastService.success("Order ID copied to clipboard."))
      .catch((error: unknown) =>
        toastService.error("Failed to copy order ID to clipboard.", error)
      );
  };
  useEffect(() => {
    if (openDropdown)
      setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 500);
  }, [openDropdown]);

  return (
    <>
      <AlertModal
        isOpen={open}
        setIsOpen={setOpen}
        onConfirm={onConfirm}
        loading={deleteOrder.isLoading}
      />
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
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
          </DropdownMenuItem>{" "}
          <DropdownMenuItem
            onClick={() =>
              router.push(
                `/admin/${params.query.storeId as string}/orders/${
                  data.id
                }/view`
              )
            }
          >
            <Eye className="mr-2 h-4 w-4" /> View
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(
                `/admin/${params.query.storeId as string}/orders/${
                  data.id
                }/edit`
              )
            }
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          {data?.isPaid && (
            <DropdownMenuItem onClick={() => shippingModal.onOpen(data.id)}>
              {data?.labelCreated ? (
                <Download className="mr-2 h-4 w-4" />
              ) : (
                <Package className="mr-2 h-4 w-4" />
              )}{" "}
              {data?.labelCreated ? "Download" : "Create"} label
            </DropdownMenuItem>
          )}
          {data?.isPaid && data?.labelCreated && (
            <DropdownMenuItem
              onClick={() =>
                updateShippingStatus.mutate({
                  orderId: data.id,
                  isShipped: true,
                })
              }
            >
              <CheckSquareIcon className="mr-2 h-4 w-4" />
              Mark as shipped
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
