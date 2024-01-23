import { useEffect, useState } from "react";

import useCart from "~/modules/cart/hooks/use-cart";

import Head from "next/head";
import Container from "~/components/core/ui/container";
import StorefrontLayout from "~/layouts/storefront-layout";
import CartItem from "~/modules/cart/components/cart-item";
import Summary from "~/modules/cart/components/summary";
import Footer from "../components/footer";
import Navbar from "../modules/navigation/navbar";

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
      <Head>
        <title>Cart | DreamWalker Studios</title>
        <meta name="description" content="Admin" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <StorefrontLayout
        mainStyle="bg-black/90"
        bodyStyle="max-w-full"
        navStyles="bg-black border-b-black"
        NavBar={Navbar}
        Footer={Footer}
      >
        <Container>
          {" "}
          <div className="px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
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
        </Container>
      </StorefrontLayout>
    </>
  );
};
