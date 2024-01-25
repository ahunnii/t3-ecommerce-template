import type { Order } from "@prisma/client";

import type { User } from "next-auth/core/types";
import { Button } from "~/components/ui/button";
import { filterOrdersByLastWeek } from "~/modules/account/libs/handle-recent-orders";

import ProfileLayout from "../profile-layout";

export const AccountHomePage = ({
  orders,
  user,
}: {
  orders: Order[];
  user: User;
}) => {
  const recentOrders = filterOrdersByLastWeek(orders);

  return (
    <ProfileLayout>
      <h1 className="text-3xl font-bold text-black">Overview</h1>
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

              {/* <p className="text-sm text-gray-500">
                It has been a while since your last order.
              </p> */}
            </div>{" "}
            <Button size={"lg"} className="bg-purple-500">
              Shop Now
            </Button>
          </div>
        </div>
      </section>
    </ProfileLayout>
  );
};
