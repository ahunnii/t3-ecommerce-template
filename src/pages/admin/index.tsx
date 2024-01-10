import { useEffect } from "react";

import { type GetServerSidePropsContext } from "next";

import { useStoreModal } from "~/hooks/use-store-modal";

import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

const Admin = () => {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
};

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
  const userRole = session.user.role;

  console.log(session.user);

  if (userRole !== "ADMIN")
    return {
      redirect: {
        destination: "/unauthorized",
        permanent: false,
      },
    };

  const store = await prisma.store.findFirst({
    where: {
      userId,
    },
  });

  if (store)
    return {
      redirect: {
        destination: `/admin/${store.id.toString()}`,
        permanent: false,
      },
    };

  return {
    props: {},
  };
}

export default Admin;
