import { useEffect, useState } from "react";

import useCart from "~/hooks/app/use-cart";

import CartItem from "~/components/app/cart/cart-item";
import Summary from "~/components/app/cart/summary";
import StorefrontLayout from "~/layouts/StorefrontLayout";

const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <StorefrontLayout>
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-black">Shopping Cart</h1>
        <div className="mt-12 gap-x-12 lg:grid lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            {cart.cartItems.length === 0 && (
              <p className="text-neutral-500">No items added to cart.</p>
            )}
            <ul>
              {cart.cartItems.map((item) => (
                <CartItem key={item.product.id} data={item} />
              ))}
            </ul>
          </div>
          <Summary />
        </div>
      </div>
    </StorefrontLayout>
  );
};

export default CartPage;
