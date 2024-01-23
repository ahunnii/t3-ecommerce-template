import { useEffect, useState } from "react";

import useCart from "~/modules/cart/hooks/use-cart";

import Head from "next/head";
import CartItem from "~/modules/cart/components/cart-item";
import Summary from "~/modules/cart/components/summary";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Confetti from "react-confetti";
import { Button } from "~/components/ui/button";
import useWindowSize from "~/hooks/use-window-size";
import StorefrontLayout from "~/layouts/storefront-layout";
import useCheckout from "~/modules/cart/hooks/use-checkout";
export const SuccessfulPurchasePage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();

  const { checkIfCheckoutWasSuccessful } = useCheckout();
  const { width, height } = useWindowSize();

  useEffect(() => {
    setIsMounted(true);
    checkIfCheckoutWasSuccessful();
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Purchase Successful | DreamWalker Studios</title>
        <meta name="description" content="Admin" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <StorefrontLayout bodyStyle="items-center justify-center flex">
        <Confetti width={width} height={height} />
        <div className="flex w-full max-w-5xl flex-col  items-center space-y-8 border border-gray-100 p-4 py-28 shadow-lg">
          <CheckCircle2 className="mx-auto h-32 w-32 text-green-500" />
          <div>
            <h1 className="text-center text-3xl font-bold text-black">
              Your order is complete!
            </h1>
            <p className="text-center text-muted-foreground">
              Thank you for shopping with us. You will be receiving a
              confirmation email with order details soon.
            </p>
          </div>
          <Button className="w-fit px-16" variant={"secondary"}>
            <Link href="/collections/all-products">Continue Shopping</Link>
          </Button>
        </div>
      </StorefrontLayout>
    </>
  );
};
