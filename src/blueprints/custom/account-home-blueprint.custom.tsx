import type { Order } from "@prisma/client";
import type { User } from "next-auth/core/types";

import ProfileLayout from "~/modules/account/components/profile-layout.wip";
import { RecentOrdersCard } from "~/modules/account/components/recent-orders-card";

import { filterOrdersByLastWeek } from "~/modules/account/libs/handle-recent-orders";
import { useConfig } from "~/providers/style-config-provider";
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
      <section className="flex w-full flex-col space-y-6 py-8">
        <div>
          <h3 className={cn(config.typography.h4)}>Recent Orders</h3>

          <RecentOrdersCard recentOrders={recentOrders} />
        </div>
      </section>
    </ProfileLayout>
  );
};
