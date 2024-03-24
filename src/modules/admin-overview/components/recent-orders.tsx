import { Prisma } from "@prisma/client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Order } from "~/modules/orders/types";

type Props = {
  data: Prisma.OrderGetPayload<{
    select: {
      storeId: true;
      email: true;
      id: true;
      paymentStatus: true;
      total: true;
      fulfillmentStatus: true;
      shippingAddress: {
        select: {
          name: true;
        };
      };

      createdAt: true;
    };
  }>[];
};

export function RecentOrders({ data }: Props) {
  return (
    <div className="space-y-8">
      {data?.map((order) => (
        <Link
          href={`/admin/${order?.storeId}/orders/${order.id}`}
          key={order.id}
          className="flex items-center"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {order?.shippingAddress?.name}
            </p>
            <p className="text-sm text-muted-foreground">{order?.email}</p>
          </div>
          <div className="ml-auto font-medium">
            ${(order?.total / 100).toFixed(2)}
          </div>
        </Link>
      ))}
    </div>
  );
}
