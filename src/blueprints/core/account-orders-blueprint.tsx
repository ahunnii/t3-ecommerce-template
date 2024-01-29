import type { Order } from "@prisma/client";

import ProfileLayout from "~/components/layouts/profile-layout";
import { UserOrderTable } from "~/modules/account/components/user-order-table";

export const AccountOrdersPage = ({ orders }: { orders: Order[] }) => {
  return (
    <ProfileLayout>
      <h1 className="text-3xl font-bold">My Orders</h1>
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
