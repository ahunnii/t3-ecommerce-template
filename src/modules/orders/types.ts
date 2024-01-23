import type { Prisma, Product } from "@prisma/client";

export type OrderItem = Prisma.OrderItemGetPayload<{
  include: {
    variant: true;
    product: {
      include: {
        variants: true;
        images: true;
      };
    };
  };
}>;

export type DetailedOrder = Prisma.OrderGetPayload<{
  include: {
    orderItems: {
      include: {
        variant: true;
        product: true;
      };
    };
    shippingLabel: true;
  };
}>;
