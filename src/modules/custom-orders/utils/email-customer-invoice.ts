import { addWeeks } from "date-fns";
import { env } from "~/env.mjs";
import { toastService } from "~/services/toast";
import type { CustomOrderColumn } from "../types";

export const emailCustomer = async (data: CustomOrderColumn) => {
  const fetchData = await fetch(`${env.NEXT_PUBLIC_API_URL}/email-customer`, {
    method: "POST",
    body: JSON.stringify({
      customerName: data?.name,
      customerEmail: data?.email,
      invoiceNumber: data?.id,
      createdAt: new Date().toDateString(),
      dueAt: addWeeks(new Date(), 1).toDateString(),
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
