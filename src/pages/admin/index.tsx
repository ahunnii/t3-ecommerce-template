import { type GetServerSidePropsContext } from "next";

import { useEffect } from "react";
import { useStoreModal } from "~/hooks/use-store-modal";

import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const userId = session.user.id;

  const store = await prisma.store.findFirst({
    where: {
      userId,
    },
  });

  if (store) {
    console.log("redirecting to store", store.id);

    return {
      redirect: {
        destination: `/admin/${store.id.toString()}`,
        permanent: false,
      },
    };
    // redirect(`/admin/${store.id.toString()}`);
  }

  return {
    props: {},
  };
}

export default function Admin() {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
}
