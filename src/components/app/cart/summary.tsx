"use client";

import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { toast } from "react-hot-toast";
import Button from "~/components/app/ui/button";
import Currency from "~/components/app/ui/currency";

import useCart from "~/hooks/app/use-cart";

const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const cartItems = useCart((state) => state.cartItems);
  const removeAll = useCart((state) => state.removeAll);

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Payment completed.");
      removeAll();
    }

    if (searchParams.get("canceled")) {
      toast.error("Something went wrong.");
    }
  }, [searchParams, removeAll]);

  const totalPrice = cartItems.reduce((total, item) => {
    return total + Number(item.product.price * item.quantity);
  }, 0);

  const onCheckout = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
      {
        productIds: cartItems?.map((item) => item.product.id),
        variantIds: cartItems?.map((item) => item?.variant?.id || "0"),
        quantity: cartItems?.map((item) => item.quantity),
      }
    );

    window.location = response.data.url;
  };
  console.log({
    productIds: cartItems?.map((item) => item.product.id),
    variantIds: cartItems?.map((item) => item?.variant?.id || null),
    quantity: cartItems?.map((item) => item.quantity),
  });

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Order total</div>
          <Currency value={totalPrice} />
        </div>
      </div>
      <Button
        onClick={onCheckout}
        disabled={cartItems.length === 0}
        className="mt-6 w-full"
      >
        Checkout
      </Button>
    </div>
  );
};

export default Summary;