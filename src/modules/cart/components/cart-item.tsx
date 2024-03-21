import { Tags, Truck, X } from "lucide-react";
import Image from "next/image";
import { type FC } from "react";

import IconButton from "~/components/common/buttons/icon-button";
import Currency from "~/components/common/currency";

import useCart from "~/modules/cart/hooks/use-cart";

import type { CartItem as TCartItem } from "~/types";

import { cn } from "~/utils/styles";
import CartItemQuantity from "./cart-item-quantity";
import CartItemVariant from "./cart-item-variant";

type TCartItemProps = { data: TCartItem };

const CartItem: FC<TCartItemProps> = ({ data }) => {
  const cart = useCart();

  const onCartRemove = () => cart.removeCartItem(data);

  const estDelivery = data?.product?.estimatedCompletion
    ? new Date(
        Date.now() +
          (data?.product?.estimatedCompletion ?? 1) *
            data?.quantity *
            24 *
            60 *
            60 *
            1000
      ).toLocaleDateString()
    : null;

  const estDeliveryEnd = data?.product?.estimatedCompletion
    ? new Date(
        Date.now() +
          24 * 60 * 60 * 1000 * 7 +
          (data?.product?.estimatedCompletion ?? 1) *
            data?.quantity *
            24 *
            60 *
            60 *
            1000
      ).toLocaleDateString()
    : null;

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
              <>
                <p className=" text-lg font-semibold text-black max-sm:line-clamp-1 ">
                  {data.product.name}
                </p>
                <CartItemVariant variant={data?.variant ?? null} />

                {estDelivery && (
                  <div className="flex items-center gap-2">
                    <Truck size={16} />{" "}
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold">Estimated Delivery:</span>{" "}
                      {estDelivery} to {estDeliveryEnd}
                    </p>
                  </div>
                )}

                <p className="flex items-center gap-2 text-xs">
                  {data?.discountBundle?.discount && <Tags size={16} />}
                  {data?.discountBundle?.discount
                    ? `${data?.discountBundle?.discount?.description}`
                    : ``}
                </p>
              </>
            </div>
            <div className="relative items-center justify-between pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
              <CartItemQuantity
                cartItem={data}
                onQuantityChange={(val) => cart.updateQuantity(data, val)}
                onQuantityEmpty={onCartRemove}
                onQuantityMax={() => void 0}
              />
            </div>
          </div>
          <div className="flex h-auto w-1/12 flex-col items-end justify-between">
            <IconButton onClick={onCartRemove} icon={<X size={15} />} />
            <div className="flex flex-col ">
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
                  "font-extrabold",
                  data?.discountBundle &&
                    "font-medium text-muted-foreground line-through"
                )}
              />
            </div>
          </div>{" "}
        </div>
      </li>
    </>
  );
};

export default CartItem;
