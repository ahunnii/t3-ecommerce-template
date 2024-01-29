import { TimeLineEntry } from "@prisma/client";

export const PAYMENT_STATUS_UPDATES: Record<string, Partial<TimeLineEntry>> = {
  PAYMENT_SUCCESSFUL: {
    type: "PAYMENT_SUCCESSFUL",
    title: "Payment Successful",
    description: "Payment was successful",
  },
  PAYMENT_FAILED: {
    type: "PAYMENT_FAILED",
    title: "Payment Failed",
    description: "Payment was unsuccessful",
  },
  PAYMENT_PENDING: {
    type: "PAYMENT_PENDING",
    title: "Payment Pending",
    description: "Payment is being processed",
  },
  ORDER_CANCELLED: {
    type: "ORDER_CANCELLED",
    title: "Order Cancelled",
    description: "Order was cancelled",
  },
  ORDER_COMPLETED: {
    type: "ORDER_COMPLETED",
    title: "Order Completed",
    description: "Order was completed",
  },
};
