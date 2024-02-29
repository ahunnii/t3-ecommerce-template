import { X } from "lucide-react";
import Image from "next/image";
import { type FC } from "react";

import Currency from "~/components/core/ui/currency";
import IconButton from "~/components/core/ui/icon-button";

import { Label } from "~/components/ui/label";
import useCart from "~/modules/cart/hooks/use-cart";

import type { CartItem as TCartItem } from "~/types";

import { toastService } from "~/services/toast";
import { cn } from "~/utils/styles";
import CartItemQuantity from "./cart-item-quantity";
import CartItemVariant from "./cart-item-variant";

type TCartItemProps = { data: TCartItem };

const CartItem: FC<TCartItemProps> = ({ data }) => {
  const cart = useCart();

  const onCartRemove = () => cart.removeCartItem(data);

  const estDelivery = new Date(
    Date.now() +
      (data?.product?.estimatedCompletion ?? 1) *
        data?.quantity *
        24 *
        60 *
        60 *
        1000
  ).toLocaleDateString();

  return (
    <>
      <li className="flex border-b py-6">
        <div className="relative h-24 w-24 overflow-hidden rounded-md sm:h-48 sm:w-48">
          <Image
            fill
            src={
              data?.product?.featuredImage ??
              data?.product.images[0]?.url ??
              "/placeholder-image.webp"
            }
            alt=""
            className="object-cover object-center"
          />
        </div>
        <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
          <div className="absolute right-0 top-0 z-10">
            <IconButton onClick={onCartRemove} icon={<X size={15} />} />
          </div>{" "}
          <div className="relative mr-10 flex h-full flex-col justify-between  ">
            <div className="relative  grid w-full grid-cols-4 justify-between gap-x-4 ">
              <p className="col-span-2 text-lg font-semibold text-black max-sm:line-clamp-1 md:col-span-3">
                {data.product.name}
              </p>

              <div className="flex flex-col">
                {data?.discountBundle && (
                  <Currency
                    value={data?.discountBundle.price}
                    className="font-extrabold text-slate-800"
                  />
                )}

                <Currency
                  value={data?.variant?.price ?? data.product.price}
                  className={cn(
                    // "col-span-2 w-full items-center  py-1 text-right md:col-span-1",
                    data?.discountBundle &&
                      "font-medium text-muted-foreground line-through"
                  )}
                />
              </div>

              {/* <Currency
                value={data?.variant?.price ?? data.product.price}
                className="col-span-2 w-full items-center  py-1 text-right md:col-span-1"
              /> */}
              <CartItemVariant variant={data?.variant ?? null} />
            </div>
            <div className="relative items-center justify-between pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
              <CartItemQuantity
                cartItem={data}
                onQuantityChange={(val) => cart.updateQuantity(data, val)}
                onQuantityEmpty={onCartRemove}
                onQuantityMax={() =>
                  toastService.inform("Maximum quantity reached")
                }
              />

              <div className="flex space-y-2 max-sm:items-center max-sm:gap-2 md:flex-col">
                <Label>Estimated Delivery:</Label>{" "}
                <p className="text-sm text-gray-600">{estDelivery} </p>
              </div>
            </div>
          </div>
        </div>
      </li>
    </>
  );
};

export default CartItem;
