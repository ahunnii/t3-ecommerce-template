import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import { toast } from "react-hot-toast";

import Button from "~/components/core/ui/button";
import Currency from "~/components/core/ui/currency";
import { env } from "~/env.mjs";

import useCart from "~/features/cart/hooks/use-cart";
import useNotification from "~/features/notifications/use-notification";
import { api } from "~/utils/api";

const CHECKOUT_URL = `${process.env.NEXT_PUBLIC_API_URL}/checkout`;

const useCheckout = () => {
  const searchParams = useSearchParams();
  const { removeAll, cartItems } = useCart((state) => state);
  const { showSuccess, showInfo } = useNotification();
  const totalPrice = cartItems.reduce((total, item) => {
    return total + Number(item.product.price) * Number(item.quantity);
  }, 0);

  const { data: store } = api.store.getStore.useQuery({
    storeId: env.NEXT_PUBLIC_STORE_ID,
  });

  useEffect(() => {
    if (searchParams.size === 0) return;

    const onSuccessfulCheckout = () => {
      showSuccess("Payment completed.");
      removeAll();
    };

    const onCanceledCheckout = () => {
      showInfo("Payment canceled.");
    };

    if (searchParams.get("success")) onSuccessfulCheckout();
    if (searchParams.get("canceled")) onCanceledCheckout();
  }, [searchParams, removeAll]);

  const calculateShippingCost = useMemo(() => {
    if (!store) return "";

    if (cartItems.length === 0) return "";

    const { hasFreeShipping, hasFlatRate, minFreeShipping, flatRateAmount } =
      store;

    if (hasFreeShipping && totalPrice >= (minFreeShipping ?? 0)) {
      return "FREE";
    } else if (hasFlatRate) {
      console.log(flatRateAmount);
      return flatRateAmount;
    } else {
      console.error("Flat rate not set up");
      return "FREE";
    }
  }, [store, totalPrice, cartItems]);

  const checkIfCheckoutWasSuccessful = () => {
    const searchParams = new URLSearchParams(window.location.search);

    if (searchParams.get("orderId")) {
      // showSuccess("Payment completed.");
      removeAll();
    }

    // if (searchParams.get("canceled")) {
    //   showInfo("Payment canceled.");
    // }
  };

  const onCheckout = async () => {
    const productIds = cartItems?.map((item) => item.product.id);
    const variantIds = cartItems?.map((item) => item?.variant?.id ?? "0");
    const quantity = cartItems?.map((item) => item.quantity);

    const response = await axios.post(CHECKOUT_URL, {
      productIds,
      variantIds,
      quantity,
      shipping: calculateShippingCost,
      cartItems,
    });

    window.location = response.data.url;
  };

  return {
    totalPrice,
    calculateShippingCost,
    onCheckout,
    checkIfCheckoutWasSuccessful,
  };
};

export default useCheckout;
