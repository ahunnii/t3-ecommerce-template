import type { CheckoutOrderDetails, PaymentOrderData } from "../types";

export const getOrderInfo = ({
  orderData,
  formattedData,
}: {
  orderData?: Partial<PaymentOrderData>;
  formattedData: CheckoutOrderDetails;
}) => ({
  ...orderData,
  name: formattedData.customerDetails.name ?? "",
  phone: formattedData.customerDetails.phone ?? "",
  email: formattedData.customerDetails.email ?? "",

  total: formattedData.totalDetails.total,
  subtotal: formattedData.totalDetails.subtotal,
  taxes: formattedData.totalDetails.tax,
  referenceId: formattedData.orderDetails.intentId,
  paymentId: formattedData.orderDetails.paymentId,
});
