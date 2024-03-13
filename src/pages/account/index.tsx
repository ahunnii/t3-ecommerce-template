import type { Order } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import type { User } from "next-auth/core/types";

import ProfileLayout from "~/modules/account/components/profile-layout.wip";
import { RecentOrdersCard } from "~/modules/account/components/recent-orders-card";

import { filterOrdersByLastWeek } from "~/modules/account/libs/handle-recent-orders";
import { getUserOrdersServerSide } from "~/modules/orders/utils/get-user-orders-server-side";
import { useConfig } from "~/providers/style-config-provider";
import { authenticateUser, redirectToSignIn } from "~/utils/auth";
import { cn } from "~/utils/styles";

type Props = {
  orders: Order[];
  user: User;
};
export const AccountHomePage = ({ orders, user }: Props) => {
  const recentOrders = filterOrdersByLastWeek(orders);
  const config = useConfig();

  return (
    <ProfileLayout>
      <h1 className={cn(config.typography.h3)}>Overview</h1>
      <p className={cn(config.typography.subheader)}>
        Welcome back, {user?.name}!
      </p>
      <section className="flex w-full flex-col  py-8">
        <h3 className={cn(config.typography.h4)}>Recent Orders</h3>

        <RecentOrdersCard recentOrders={recentOrders} />
      </section>
    </ProfileLayout>
  );
};

export default AccountHomePage;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const user = await authenticateUser(ctx);
  if (!user) return redirectToSignIn();
  const orders = await getUserOrdersServerSide(user.id);
  return { props: { user, orders } };
}
