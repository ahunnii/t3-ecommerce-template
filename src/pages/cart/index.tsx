import { useEffect, useState } from "react";

import StorefrontLayout from "~/components/layouts/storefront-layout";
import { useConfig } from "~/providers/style-config-provider";
import { cn } from "~/utils/styles";

import { CartItem, Summary, useCart } from "~/modules/cart";

const metadata = {
  title: "Cart | Trend Anomaly",
  description: "Break out the system!",
};

const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();
  const config = useConfig();

  // Avoid hydration errors with cart
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <StorefrontLayout {...config.layout} metadata={metadata}>
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <h1
          className={cn(
            "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
            config.typography.h1
          )}
        >
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
          <Summary cartSize={cart.cartItems.length ?? 0} />
        </div>
      </div>
    </StorefrontLayout>
  );
};

export default CartPage;
