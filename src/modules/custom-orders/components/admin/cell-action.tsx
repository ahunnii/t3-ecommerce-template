import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import {
  Copy,
  Download,
  Edit,
  Eye,
  Mail,
  MoreHorizontal,
  Trash,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import * as Dropdown from "~/components/ui/dropdown-menu";
import { AlertModal } from "~/modules/admin/components/modals/alert-modal";

import { api } from "~/utils/api";

import { toastService } from "~/services/toast";
import type { CustomOrderColumn } from "../../types";
import { saveAsPDF } from "../../utils/save-as-pdf";

interface CellActionProps {
  data: CustomOrderColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);

  const params = useRouter();
  const apiContext = api.useContext();
  const { storeId } = params.query as { storeId: string };
  const customOrderId = data.id;

  const baseUrl = `/admin/${storeId}/custom-orders/${customOrderId}`;

  const deleteCustomOrder = api.customOrder.deleteCustomRequest.useMutation({
    onSuccess: () =>
      toastService.success("Custom request was successfully deleted"),
    onError: (error: unknown) => {
      toastService.error(
        "There was an error deleting the custom request. Please try again later.",
        error
      );
    },
    onSettled: () => {
      void apiContext.customOrder.invalidate();
      setOpen(false);
    },
  });

  const onConfirm = () => deleteCustomOrder.mutate({ customOrderId });
  const onDeleteSelection = () => setOpen(true);

  const onCopySelection = () => {
    navigator.clipboard
      .writeText(customOrderId)
      .then(() =>
        toastService.success("Custom order request id copied to clipboard.")
      )
      .catch((e) =>
        toastService.error(
          "Failed to copy Custom order request ID to clipboard.",
          e
        )
      );
  };

  const emailCustomerInvoice = api.customOrder.emailCustomerInvoice.useMutation(
    {
      onSuccess: () =>
        toastService.success("Customer invoice was successfully sent"),
      onError: (error: unknown) => {
        toastService.error(
          "There was an error sending the customer invoice. Please try again later.",
          error
        );
      },
    }
  );

  const generateCustomerInvoice =
    api.customOrder.generateCustomOrderInvoice.useMutation({
      onSuccess: (data) => {
        // Convert the buffer into an object URL
        saveAsPDF(data);
        toastService.success("Customer invoice was successfully generated");
      },
      onError: (error: unknown) => {
        toastService.error(
          "There was an error generating the customer invoice. Please try again later.",
          error
        );
      },
    });

  const isLoading = deleteCustomOrder.isLoading;
  return (
    <>
      <AlertModal
        isOpen={open}
        setIsOpen={setOpen}
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

          {data.status === "ACCEPTED" && (
            <Dropdown.DropdownMenuItem
              className="cursor-pointer"
              onClick={() => generateCustomerInvoice.mutate({ customOrderId })}
            >
              <Download className="mr-2 h-4 w-4" /> Download Invoice
            </Dropdown.DropdownMenuItem>
          )}

          {data.status === "ACCEPTED" && (
            <Dropdown.DropdownMenuItem
              className="cursor-pointer"
              onClick={() =>
                emailCustomerInvoice.mutate({
                  customOrderId,
                })
              }
            >
              <Mail className="mr-2 h-4 w-4" /> Resend Customer Invoice
            </Dropdown.DropdownMenuItem>
          )}
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
