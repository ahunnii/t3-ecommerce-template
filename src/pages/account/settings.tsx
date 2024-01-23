import { Order } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { Session, User } from "next-auth/core/types";
import { Button } from "~/components/ui/button";
import ProfileLayout from "~/layouts/profile-layout";
import { filterOrdersByLastWeek } from "~/modules/account/libs/handle-recent-orders";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

const ProfilePage = ({ orders, user }: { orders: Order[]; user: User }) => {
  const recentOrders = filterOrdersByLastWeek(orders);

  console.log(recentOrders);
  return (
    <ProfileLayout>
      <h1 className="text-3xl font-bold">Overview</h1>
      <p className="text-foreground-muted">Welcome back, {user?.name}!</p>
      <section className="flex w-full flex-col space-y-6 py-8">
        <div>
          <h3 className="text-xl">Recent Orders</h3>
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
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
            <Button size={"lg"}>Shop Now</Button>
          </div>
        </div>
      </section>
    </ProfileLayout>
  );
};

export default ProfilePage;

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
