import { format } from "date-fns";
import { formatter } from "~/utils/styles";
import type { DetailedOrder } from "../types";

export const formatOrderTableData = (item: DetailedOrder) => ({
  id: item.id,
  storeId: item.storeId,
  phone: item.phone,
  name: item.name,
  address: item.address,
  shippingLabel: item.shippingLabel,
  timeline: item.timeline,
  products: item.orderItems
    .map((orderItem) => orderItem.product.name)
    .join(", "),
  total: item.orderItems.reduce((total, item) => {
    return total + Number(item.product.price);
  }, 0),

  isPaid: item.isPaid,
  isShipped: item.isShipped,
  labelCreated: item.shippingLabel?.labelUrl ? true : false,
  createdAt: item.createdAt,
});
