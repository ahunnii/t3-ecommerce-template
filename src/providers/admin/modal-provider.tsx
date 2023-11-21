"use client";

import { useEffect, useState } from "react";

import { ShippingModal } from "~/components/admin/modals/shipping-modal";
import { StoreModal } from "~/components/admin/modals/store-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <StoreModal />
      <ShippingModal />
    </>
  );
};
