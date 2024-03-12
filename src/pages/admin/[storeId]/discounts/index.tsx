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
        <div className="flex h-full flex-col">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <DiscountsClient data={getDiscounts.data ?? []} />
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default DiscountsPage;
