import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";

import useCart from "~/modules/cart/hooks/use-cart";

import { toastService } from "~/services/toast";
import { api } from "~/utils/api";

const CHECKOUT_URL = `${process.env.NEXT_PUBLIC_API_URL}/checkout`;

const useCheckout = () => {
  const searchParams = useSearchParams();
  const { removeAll, cartItems } = useCart((state) => state);

  const totalPrice = cartItems.reduce((total, item) => {
    return (
      total +
      Number(item?.variant?.price ?? item.product.price) * Number(item.quantity)
    );
  }, 0);

  const totalDiscount = cartItems.reduce((total, item) => {
    return (
      total +
      Number(
        item?.discountBundle
          ? item?.discountBundle?.price
          : item?.variant?.price ?? item.product.price
      ) *
        Number(item.quantity)
    );
  }, 0);

  const totalDiscountDifference = cartItems.reduce((total, item) => {
    return (
      total +
      (item?.discountBundle
        ? Number(
            (item?.variant?.price ?? item.product.price) -
              item?.discountBundle?.price ?? 0
          ) * Number(item.quantity)
        : 0)
    );
  }, 0);

  const { data: store } = api.store.getStore.useQuery({});

  useEffect(() => {
    if (searchParams.size === 0) return;

    const onSuccessfulCheckout = () => {
      toastService.success("Payment completed.");
      removeAll();
    };

    const onCanceledCheckout = () => {
      toastService.inform("Payment canceled.");
    };

    if (searchParams.get("success")) onSuccessfulCheckout();
    if (searchParams.get("canceled")) onCanceledCheckout();
  }, [searchParams, removeAll]);

  const calculateShippingCost: number = useMemo(() => {
    if (!store) return 0;
    if (cartItems.length === 0) return 0;

    const { hasFreeShipping, hasFlatRate, minFreeShipping, flatRateAmount } =
      store;

    if (hasFreeShipping && totalPrice >= (minFreeShipping ?? 0)) return 0;
    else if (hasFlatRate) {
      if (flatRateAmount) return flatRateAmount ?? 0;
      else {
        console.error("Checkout Summary Error: Flat rate not set up");
        return 0;
      }
    } else {
      console.error("Checkout Summary Error: Flat rate not set up");
      return 0;
    }
  }, [store, totalPrice, cartItems]);

  const checkIfCheckoutWasSuccessful = useCallback(() => {
    const searchParams = new URLSearchParams(window.location.search);

    if (searchParams.get("orderId")) {
      // showSuccess("Payment completed.");
      removeAll();
    }

    // if (searchParams.get("canceled")) {
    //   showInfo("Payment canceled.");
    // }
  }, [removeAll]);

  const onCheckout = async () => {
    const productIds = cartItems?.map((item) => item.product.id);
    const variantIds = cartItems?.map((item) => item?.variant?.id ?? "0");
    const quantity = cartItems?.map((item) => item.quantity);

    // Check if order is within free shipping threshold if store has free shipping

    const checkIfOrderQualifiesForFreeShipping =
      totalPrice >= (store?.minFreeShipping ?? 0);

    const shippingThing = store?.hasFreeShipping
      ? checkIfOrderQualifiesForFreeShipping
        ? {
            type: "FREE",
            label: "Free Shipping",
            cost: 0,
          }
        : {
            type: "FLAT_RATE",
            label:
              "Once shipped, typically takes 5-7 business days before delivery.",
            cost: store?.flatRateAmount,
          }
      : {
          type: "FLAT_RATE",
          label:
            "Once shipped, typically takes 5-7 business days before delivery.",
          cost: store?.flatRateAmount,
        };
    const response = await axios.post(CHECKOUT_URL, {
      productIds,
      variantIds,
      quantity,
      shipping: calculateShippingCost,
      cartItems,
      shippingObject: shippingThing,
    });

    window.location = response.data.url;
  };

  return {
    totalPrice,
    totalDiscount,
    totalDiscountDifference,
    calculateShippingCost,
    onCheckout,
    checkIfCheckoutWasSuccessful,
  };
};

export default useCheckout;
