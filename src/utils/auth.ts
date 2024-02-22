import type { GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

export const authenticateSession = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(ctx);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  const userId = session.user.id;
  const userRole = session.user.role;

  if (userRole !== "ADMIN") {
    return {
      redirect: {
        destination: "/unauthorized",
        permanent: false,
      },
    };
  }

  const store = await prisma.store.findFirst({
    where: {
      id: ctx.query.storeId as string,
      userId,
    },
  });

  return store;
};

export const authenticateUser = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(ctx);
  if (!session || !session.user) return null;
  return session.user;
};

export const redirectToSignIn = () => {
  return {
    redirect: {
      destination: "/sign-in",
      permanent: false,
    },
  };
};

export const authenticateAdminOrOwner = async (
  ctx: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(ctx);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  const userId = session.user.id;
  const userRole = session.user.role;

  if (userRole !== "ADMIN") {
    return {
      store: null,
      user: null,
      redirect: {
        destination: "/unauthorized",
        permanent: false,
      },
    };
  }

  const store = await prisma.store.findFirst({
    where: {
      id: ctx.query.storeId as string,
    },
  });

  if (!store) {
    return {
      store: null,
      user: null,
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  if (store.userId !== userId) {
    return {
      store: null,
      user: null,
      redirect: {
        destination: "/unauthorized",
        permanent: false,
      },
    };
  }

  return {
    store,
    user: session.user,
    redirect: null,
  };
};
