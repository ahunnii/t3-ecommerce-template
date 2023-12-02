"use client";

import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { toast } from "react-hot-toast";
import Button from "~/components/core/ui/button";
import Currency from "~/components/core/ui/currency";

import useCart from "~/hooks/core/use-cart";

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
    return total + Number(item.product.price) * Number(item.quantity);
  }, 0);

  const onCheckout = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
      {
        productIds: cartItems?.map((item) => item.product.id),
        variantIds: cadrtItems?.map((item) => item?.variant?.id || "0"),
        quantity: cartItems?.map((item) => item.quantity),
      }
    );

    window.location = response.data.url;
  };

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
        onClick={() => void onCheckout()}
        disabled={cartItems.length === 0}
        className="mt-6 w-full"
      >
        Checkout
      </Button>
      <p className="mt-3 w-full text-center text-muted-foreground">
        Shipping and taxes calculated at checkout
      </p>
    </div>
  );
};

export default Summary;
