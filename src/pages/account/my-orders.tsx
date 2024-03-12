import type { Order } from "@prisma/client";

import { UserOrderTable } from "~/modules/account/components/user-order-table";

import { GetServerSidePropsContext } from "next";
import { getUserOrdersServerSide } from "~/modules/orders/utils/get-user-orders-server-side";
import { useConfig } from "~/providers/style-config-provider";
import { authenticateUser, redirectToSignIn } from "~/utils/auth";
import { cn } from "~/utils/styles";
import ProfileLayout from "../../modules/account/components/profile-layout.wip";

export const AccountOrdersPage = ({ orders }: { orders: Order[] }) => {
  const config = useConfig();
  return (
    <ProfileLayout>
      <h1 className={cn(config.typography.h3)}>My Orders</h1>
      <p className={cn(config.typography.subheader)}>
        Check out your order history.
      </p>
      <section className="flex w-full flex-col space-y-6 py-8">
        <div className="flex flex-row items-center justify-between rounded-lg ">
          <UserOrderTable orders={orders} />
        </div>
      </section>
    </ProfileLayout>
  );
};

export default AccountOrdersPage;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const user = await authenticateUser(ctx);

  if (!user) return redirectToSignIn();

  const orders = await getUserOrdersServerSide(user.id);

  return { props: { orders } };
}
