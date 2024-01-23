import { format } from "date-fns";
import { formatter } from "~/utils/styles";
import type { DetailedOrder } from "../types";

export const formatOrderTableData = (item: DetailedOrder) => ({
  id: item.id,
  phone: item.phone,
  name: item.name,
  address: item.address,
  products: item.orderItems
    .map((orderItem) => orderItem.product.name)
    .join(", "),
  totalPrice: formatter.format(
    item.orderItems.reduce((total, item) => {
      return total + Number(item.product.price);
    }, 0)
  ),
  isPaid: item.isPaid,
  isShipped: item.isShipped,
  labelCreated: item.shippingLabel?.labelUrl ? true : false,
  createdAt: format(item.createdAt, "MMMM do, yyyy"),
});
