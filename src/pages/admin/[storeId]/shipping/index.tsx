import type { GetServerSidePropsContext } from "next";
import { useEffect, useMemo, type FC } from "react";

import { OrderClient } from "~/modules/orders/components/admin/client";
import type { OrderColumn } from "~/modules/orders/components/admin/columns";
import { ShippingModal } from "~/modules/shipping/components/shipping-modal";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import Shippo from "shippo";
import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import AdminLayout from "~/components/layouts/admin-layout";
import { formatOrderTableData } from "~/modules/orders/utils/format-order-table-data";
import { ShippingClient } from "~/modules/shipping/components/client";
import { useShippingModal } from "~/modules/shipping/hooks/use-shipping-modal";
import type { DetailedOrder } from "~/types";

interface IProps {
  storeId: string;
}

const ShippingPage: FC<IProps> = ({ storeId }) => {
  const { data: shipments, isLoading } =
    api.shippingLabels.getShipments.useQuery();

  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}

      {!isLoading && <ShippingClient data={shipments ?? []} />}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default ShippingPage;
