import type { Order } from "@prisma/client";
import type { User } from "next-auth/core/types";

import { Button } from "~/components/ui/button";
import ProfileLayout from "~/components/wip/profile-layout.wip";

import { filterOrdersByLastWeek } from "~/modules/account/libs/handle-recent-orders";
import { useConfig } from "~/providers/style-config-provider";
import { cn } from "~/utils/styles";

type AccountHomePageProps = {
  orders: Order[];
  user: User;
};
export const AccountHomePage = ({ orders, user }: AccountHomePageProps) => {
  const recentOrders = filterOrdersByLastWeek(orders);
  const config = useConfig();

  return (
    <ProfileLayout>
      <h1 className={cn(config.typography.h3)}>Overview</h1>
      <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
      <section className="flex w-full flex-col space-y-6 py-8">
        <div>
          <h3 className="text-xl text-black">Recent Orders</h3>
          <div className="flex flex-row items-center justify-between rounded-lg border border-black/25 p-4">
            <div className="space-y-0.5">
              {recentOrders.length > 0 ? (
                <>
                  <p className="text-base font-bold text-gray-700">
                    {recentOrders.length} orders in the last week.
                  </p>
                  <p className="text-sm text-gray-500">Keep it up!</p>
                </>
              ) : (
                <>
                  <p className="text-base font-bold text-gray-700">
                    You haven&apos;t placed any orders recently.
                  </p>
                </>
              )}
            </div>
            <Button size={"lg"} className={cn("")}>
              Shop Now
            </Button>
          </div>
        </div>
      </section>
    </ProfileLayout>
  );
};
