import { useEffect, useState } from "react";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import StorefrontLayout from "~/components/layouts/storefront-layout";

import { CartItem, Summary, useCart } from "~/modules/cart";

export const CartPageBlueprint = () => {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();

  // Avoid hydration errors with cart
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <AbsolutePageLoader />;

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
                <CartItem
                  key={item.product.id + item?.variant?.id}
                  data={item}
                />
              ))}
            </ul>
          </div>
          <Summary cartSize={cart.cartItems.length ?? 0} />
        </div>
      </div>
    </StorefrontLayout>
  );
};
