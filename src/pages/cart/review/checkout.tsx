import { useEffect, useState } from "react";

import useCart from "~/modules/cart/hooks/use-cart";

import CheckoutLayout from "~/layouts/CheckoutLayout";
import CartItem from "~/modules/cart/components/cart-item";
import Summary from "~/modules/cart/components/summary";

const CheckoutPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <CheckoutLayout>
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-black">
          Double check your order details
        </h1>
        <div className="mt-12 gap-x-12 lg:grid lg:grid-cols-12 lg:items-start">
          <div className="flex flex-col gap-y-3 lg:col-span-7">
            {" "}
            <h2 className="text-lg font-semibold">Shipping address</h2>
            <div className="flex flex-col space-y-0 rounded-md border p-4">
              <p>{cart.customerName}</p>
              <p>{cart.shippingAddress}</p>
              <p>
                {cart.shippingCity}, {cart.shippingState}, {cart.shippingZip}
              </p>
            </div>
            <h2 className="text-lg font-semibold">Payment method</h2>
            <div className="flex flex-col   space-y-0 rounded-md border p-4">
              <p className="capitalize">{cart.paymentType}</p>
            </div>
          </div>{" "}
          <Summary />
          <div className="my-5 lg:col-span-7">
            <h2 className="text-lg font-semibold">Items to be ordered</h2>
            {cart.cartItems.length === 0 && (
              <p className="text-neutral-500">No items added to cart.</p>
            )}
            <ul>
              {cart.cartItems.map((item) => (
                <CartItem key={item.product.id} data={item} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </CheckoutLayout>
  );
};

export default CheckoutPage;
