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
