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
  total: item.total,
  status: `${item.status}`,

  isPaid: item.isPaid,
  isShipped: item.isShipped,
  labelCreated: item.shippingLabel?.labelUrl ? true : false,
  createdAt: item.createdAt,
});
