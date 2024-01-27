import { Order } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { Session, User } from "next-auth/core/types";
import { Button } from "~/components/ui/button";
import { UserOrderTable } from "~/modules/account/components/user-order-table";
import { filterOrdersByLastWeek } from "~/modules/account/libs/handle-recent-orders";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
import ProfileLayout from "../../components/wip/profile-layout.wip";

export const AccountOrdersPage = ({ orders }: { orders: Order[] }) => {
  return (
    <ProfileLayout>
      <h1 className="text-3xl font-bold">My Orders</h1>
      {/* <p className="text-foreground-muted">Welcome back, {user?.name}!</p> */}
      <section className="flex w-full flex-col space-y-6 py-8">
        <div>
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <UserOrderTable orders={orders} />
          </div>
        </div>
      </section>
    </ProfileLayout>
  );
};
