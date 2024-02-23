import { useEffect } from "react";

import { type GetServerSidePropsContext } from "next";

import { useStoreModal } from "~/hooks/use-store-modal";

import { authenticateAdminOrOwner } from "~/utils/auth";

const PreAdminPage = () => {
  const { onOpen, isOpen } = useStoreModal((state) => state);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default PreAdminPage;
