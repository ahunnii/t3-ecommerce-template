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

export const redirectToUnauthorized = () => {
  return {
    redirect: {
      destination: "/sign-in",
      permanent: false,
    },
  };
};

export const redirectToAdmin = () => {
  return {
    redirect: {
      destination: "/admin",
      permanent: false,
    },
  };
};
export const authenticateAdminOrOwner = async (
  ctx: GetServerSidePropsContext,
  conditional?: (ctx: GetServerSidePropsContext) => unknown
) => {
  const session = await getServerAuthSession(ctx);

  if (!session || !session.user) return redirectToSignIn();

  const { id, role } = session.user;

  const storeId = ctx.query.storeId;

  if (!storeId) {
    const store = await prisma.store.findFirst({});

    if (store && (role === "ADMIN" || store.userId === id)) {
      return {
        redirect: {
          destination: `/admin/${store.id.toString()}`,
          permanent: false,
        },
      };
    }
  }

  const store = await prisma.store.findUnique({
    where: {
      id: ctx.query.storeId as string,
    },
  });

  if (!store) redirectToAdmin();

  if (role !== "ADMIN" && store?.userId !== id) redirectToUnauthorized();

  if (conditional) return conditional(ctx);

  return {
    props: {
      user: session.user,
      storeId: ctx.query.storeId ?? "",
    },
  };
};
