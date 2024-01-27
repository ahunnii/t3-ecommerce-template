import { useEffect } from "react";

import Confetti from "react-confetti";

import StorefrontLayout from "~/components/layouts/storefront-layout";
import useWindowSize from "~/hooks/use-window-size";

import { SuccessPanel, useCheckout } from "~/modules/cart";
export const SuccessfulPurchasePage = () => {
  const { checkIfCheckoutWasSuccessful } = useCheckout();
  const { width, height } = useWindowSize();

  useEffect(() => {
    checkIfCheckoutWasSuccessful();
  }, [checkIfCheckoutWasSuccessful]);

  return (
    <>
      <StorefrontLayout bodyStyle="items-center justify-center flex">
        <Confetti width={width} height={height} />
        <SuccessPanel />
      </StorefrontLayout>
    </>
  );
};
