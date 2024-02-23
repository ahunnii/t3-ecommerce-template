import type { Order } from "@prisma/client";

import { UserOrderTable } from "~/modules/account/components/user-order-table";

import { useConfig } from "~/providers/style-config-provider";
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
        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
          <UserOrderTable orders={orders} />
        </div>
      </section>
    </ProfileLayout>
  );
};
