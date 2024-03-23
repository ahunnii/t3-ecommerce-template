import Link from "next/link";
import { ViewSection } from "~/components/common/sections/view-section.admin";
import { ScrollArea } from "~/components/ui/scroll-area";
import { api } from "~/utils/api";
import { AdvancedDataTable } from "./advanced-data-table";
import {
  OrderHistoryColumns,
  orderHistoryColumns,
} from "./order-history-columns";

import { statuses } from "./orders-table-data";

type ViewOrderCustomerProps = {
  storeId: string;
  customerId: string | null | undefined;
};

export const ViewOrderCustomerHistory = ({
  storeId,
  customerId,
}: ViewOrderCustomerProps) => {
  const getCustomerOrders = api.orders.getCustomerOrderHistory.useQuery(
    { customerId: customerId! },
    {
      enabled: !!customerId,
    }
  );
  return (
    <ViewSection title="Order History" description="Check out past orders">
      {getCustomerOrders?.data && (
        <AdvancedDataTable
          searchKey="name"
          columns={orderHistoryColumns}
          data={getCustomerOrders?.data as OrderHistoryColumns[]}
          filters={[statuses]}
        />
      )}
    </ViewSection>
  );
};
