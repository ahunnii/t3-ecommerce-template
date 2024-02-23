import type { Order } from "@prisma/client";
import { Button } from "~/components/ui/button";
import { cn } from "~/utils/styles";
export const RecentOrdersCard = ({
  recentOrders,
}: {
  recentOrders: Order[];
}) => {
  return (
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
  );
};
