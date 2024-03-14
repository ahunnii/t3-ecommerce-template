import { Tags, Truck, X } from "lucide-react";
import Image from "next/image";
import { type FC } from "react";

import IconButton from "~/components/common/buttons/icon-button";
import Currency from "~/components/common/currency";

import { Label } from "~/components/ui/label";
import useCart from "~/modules/cart/hooks/use-cart";

import type { Prisma, OrderItem as TCartItem } from "@prisma/client";

import { toastService } from "~/services/toast";
import { cn } from "~/utils/styles";
import CartItemQuantity from "./cart-item-quantity";
import CartItemVariant from "./cart-item-variant";

type TOrderItem = Prisma.OrderItemGetPayload<{
  include: {
    product: {
      include: {
        images: true;
      };
    };
    variant: true;
    discount: true;
  };
}>;

type TCartItemProps = { data: TOrderItem };

export const OrderViewItem: FC<TCartItemProps> = ({ data }) => {
  return (
    <>
      <li className="flex border-b py-6">
        <div className="place-self-center ">
          <div className="relative h-24  w-24 rounded-md sm:h-36 sm:w-36 ">
            <Image
              fill
              src={
                data?.product?.featuredImage ??
                data?.product.images[0]?.url ??
                "/placeholder-image.webp"
              }
              alt=""
              className="object-cover object-center"
              sizes={"(min-width: 1024px) 300px"}
            />
          </div>
        </div>

        <div className="relative ml-4 flex w-4/6  flex-1  justify-between sm:ml-6">
          <div className="relative mr-10 flex h-full w-11/12 flex-col  justify-between">
            <div className="relative   w-full justify-between gap-x-4 ">
              <p className=" text-lg font-semibold text-black max-sm:line-clamp-1 ">
                {data.product.name}
              </p>
              <p>{data.variant?.values}</p>
            </div>
            <div className="relative items-center justify-between pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
              {data.quantity}
            </div>
          </div>
          <div className="flex h-auto w-1/12 flex-col items-end justify-between">
            <div className="flex flex-col ">
              {data?.discount && <p>{data?.discount?.description}</p>}

              <Currency
                value={data?.variant?.price ?? data.product.price}
                className={cn(
                  // "col-span-2 w-full items-center  py-1 text-right md:col-span-1",
                  "font-extrabold"
                )}
              />
            </div>
          </div>{" "}
        </div>
      </li>
    </>
  );
};
