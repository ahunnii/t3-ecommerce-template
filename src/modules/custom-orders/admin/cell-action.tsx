import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { Copy, Download, Edit, Eye, MoreHorizontal, Trash } from "lucide-react";

import { AlertModal } from "~/components/admin/modals/alert-modal";
import { Button } from "~/components/ui/button";
import * as Dropdown from "~/components/ui/dropdown-menu";

import { api } from "~/utils/api";

import { env } from "~/env.mjs";
import { emailService } from "~/services/email_new";
import { toastService } from "~/services/toast";
import type { CustomOrderColumn } from "./columns";

interface CellActionProps {
  data: CustomOrderColumn;
}

function addWeeks(weeks: number, date = new Date()): Date {
  date.setDate(date.getDate() + weeks * 7);

  return date;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);

  const params = useRouter();
  const apiContext = api.useContext();
  const { storeId } = params.query as { storeId: string };
  const billboardId = data.id;

  const baseUrl = `/admin/${storeId}/custom-orders/${billboardId}`;

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

  const onConfirm = () => deleteBillboard({ billboardId });
  const onDeleteSelection = () => setOpen(true);

  const onCopySelection = () => {
    navigator.clipboard
      .writeText(billboardId)
      .then(() => toastService.success("Billboard ID copied to clipboard."))
      .catch((e) =>
        toastService.error("Failed to copy billboard ID to clipboard.", e)
      );
  };

  // container function to generate the Invoice
  const generateInvoice = (e: MouseEvent) => {
    e.preventDefault();
    // send a post request with the name to our API endpoint

    if (data?.store?.address === null) {
      toastService.error(
        "Unable to generate invoice. Your store's address isn't set.",
        "Store address is null"
      );
      return;
    }
    const fetchData = async () => {
      const invoiceData = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/generate-invoice`,
        {
          method: "POST",
          body: JSON.stringify({
            customerName: data?.name,
            customerEmail: data?.email,
            invoiceNumber: data?.id,
            createdAt: new Date().toDateString(),
            dueAt: addWeeks(1, new Date()).toDateString(),
            businessLogo: `${env.NEXT_PUBLIC_URL}/custom/logo.png`,
            businessName: data?.store?.name,
            businessStreet: data?.store?.address?.street ?? "",
            businessCity: data?.store?.address?.city ?? "",
            businessState: data?.store?.address?.state ?? "",
            businessPostalCode: data?.store?.address?.postal_code ?? "",
            product: data?.product?.name ?? "",
            productCost: data?.product?.price ?? 0.0,
            productTotal: data?.product?.price ?? 0.0,
            productLink: `${env.NEXT_PUBLIC_URL}/product/${data?.product?.id}`,
            productDescription: data?.product?.description ?? "",
          }),
        }
      );
      // convert the response into an array Buffer
      return invoiceData.arrayBuffer();
    };

    // convert the buffer into an object URL
    const saveAsPDF = async () => {
      const buffer = await fetchData();
      const blob = new Blob([buffer]);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "invoice.pdf";
      link.click();
    };

    void saveAsPDF();
  };

  const emailCustomer = async () => {
    const fetchData = await fetch(`${env.NEXT_PUBLIC_API_URL}/email-customer`, {
      method: "POST",
      body: JSON.stringify({
        customerName: data?.name,
        customerEmail: data?.email,
        invoiceNumber: data?.id,
        createdAt: new Date().toDateString(),
        dueAt: addWeeks(1, new Date()).toDateString(),
        businessLogo: `${env.NEXT_PUBLIC_URL}/custom/logo.png`,
        businessName: data?.store?.name,
        businessStreet: data?.store?.address?.street ?? "",
        businessCity: data?.store?.address?.city ?? "",
        businessState: data?.store?.address?.state ?? "",
        businessPostalCode: data?.store?.address?.postal_code ?? "",
        product: data?.product?.name ?? "",
        productCost: data?.product?.price ?? 0.0,
        productTotal: data?.product?.price ?? 0.0,
        productLink: `${env.NEXT_PUBLIC_URL}/product/${data?.product?.id}`,
        productDescription: data?.product?.description ?? "",
      }),
    });

    if (fetchData?.status === 200) {
      toastService.success("Email Sent");
    } else {
      toastService.error("Error", "");
    }
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

          {data.status === "ACCEPTED" && (
            <Dropdown.DropdownMenuItem
              className="cursor-pointer"
              onClick={generateInvoice}
            >
              <Download className="mr-2 h-4 w-4" /> Download Invoice
            </Dropdown.DropdownMenuItem>
          )}

          {data.status === "ACCEPTED" && (
            <Dropdown.DropdownMenuItem
              className="cursor-pointer"
              onClick={emailCustomer}
            >
              <Download className="mr-2 h-4 w-4" /> Email Customer
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
