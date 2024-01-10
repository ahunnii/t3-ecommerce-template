import { Order } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { Session, User } from "next-auth/core/types";
import { Button } from "~/components/ui/button";
import { UserOrderTable } from "~/features/account/components/user-order-table";
import { filterOrdersByLastWeek } from "~/features/account/libs/handle-recent-orders";
import ProfileLayout from "~/layouts/profile-layout";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

const ProfilePage = ({ orders, user }: { orders: Order[]; user: User }) => {
  console.log(orders);
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
