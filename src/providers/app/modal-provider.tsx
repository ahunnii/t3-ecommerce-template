"use client";

import { useEffect, useState } from "react";

import PreviewModal from "~/components/app/preview-modal";

const StorefrontModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <PreviewModal />
    </>
  );
};

export default StorefrontModalProvider;
