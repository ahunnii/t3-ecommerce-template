import { type FC } from "react";

import type { GetServerSidePropsContext } from "next";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import AdminLayout from "~/components/layouts/admin-layout";

import { DiscountsClient } from "~/modules/discounts/admin/client";

interface IProps {
  storeId: string;
}

const DiscountsPage: FC<IProps> = ({ storeId }) => {
  const getDiscounts = api.discounts.getAllDiscounts.useQuery({
    storeId,
  });

  return (
    <AdminLayout>
      {getDiscounts.isLoading && <AbsolutePageLoader />}

      {!getDiscounts.isLoading && (
        <DiscountsClient data={getDiscounts.data ?? []} />
      )}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default DiscountsPage;
