import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import AdminLayout from "~/components/layouts/admin-layout";

import { ShippingClient } from "~/modules/shipping/components/client";

interface IProps {
  storeId: string;
}

const ShippingPage: FC<IProps> = () => {
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
