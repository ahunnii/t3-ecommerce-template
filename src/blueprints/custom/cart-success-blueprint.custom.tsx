import { useEffect } from "react";

import Confetti from "react-confetti";

import StorefrontLayout from "~/components/layouts/storefront-layout";
import useWindowSize from "~/hooks/use-window-size";
import { useConfig } from "~/providers/style-config-provider";

import { SuccessPanel, useCheckout } from "~/modules/cart";

const metadata = {
  title: "Purchase Successful | Trend Anomaly",
  description: "Break out of the system!",
};

export const SuccessfulPurchasePage = () => {
  const { checkIfCheckoutWasSuccessful } = useCheckout();
  const { width, height } = useWindowSize();
  const config = useConfig();

  useEffect(() => {
    checkIfCheckoutWasSuccessful();
  }, [checkIfCheckoutWasSuccessful]);

  return (
    <>
      <StorefrontLayout
        {...config.layout}
        bodyStyle="items-center justify-center flex"
        metadata={metadata}
      >
        <Confetti width={width} height={height} />
        <SuccessPanel />
      </StorefrontLayout>
    </>
  );
};
