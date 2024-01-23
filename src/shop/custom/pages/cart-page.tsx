import { useEffect, useState } from "react";

import useCart from "~/modules/cart/hooks/use-cart";

import StorefrontLayout from "~/layouts/storefront-layout";
import CartItem from "~/modules/cart/components/cart-item";
import Summary from "~/modules/cart/components/summary";

import { SEO } from "~/shop/custom/components/seo-head";
import { storeTheme } from "~/shop/custom/config";

export const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SEO
        title={`Checkout | Trend Anomaly`}
        description={"Break out the system!"}
      />

      <StorefrontLayout {...storeTheme.layout}>
        {" "}
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Shopping Cart
          </h1>
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
            <Summary type="dark" />
          </div>
        </div>
      </StorefrontLayout>
    </>
  );
};
