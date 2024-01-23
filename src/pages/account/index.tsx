import { Order } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { Session, User } from "next-auth/core/types";
import { Button } from "~/components/ui/button";
import ProfileLayout from "~/layouts/profile-layout";
import { filterOrdersByLastWeek } from "~/modules/account/libs/handle-recent-orders";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";
import { AccountHomePage as DefaultAccountHomePage } from "~/shop/core/pages/account-home";
import { AccountHomePage as CustomAccountHomePage } from "~/shop/custom/pages/account-home";
import { api } from "~/utils/api";

import useStorePageRender from "~/hooks/use-store-page-render";
const AccountPage = (props: { orders: Order[]; user: User }) => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultAccountHomePage {...props} />;

  return <CustomAccountHomePage {...props} />;
};

export default AccountPage;

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

  const user = session.user;

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
  });

  const formattedOrders = orders.map((order) => {
    return {
      ...order,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  });

  return {
    props: {
      user,
      orders: formattedOrders,
    },
  };
}
