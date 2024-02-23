import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { authenticateAdminOrOwner } from "~/utils/auth";

import AdminLayout from "~/components/layouts/admin-layout";
import PageLoader from "~/components/ui/page-loader";
import { SettingsForm } from "~/modules/settings/settings-form";
import { api } from "~/utils/api";

interface IProps {
  storeId: string;
}
const SettingsPage: FC<IProps> = ({ storeId }) => {
  const { data: store, isLoading } = api.store.getStore.useQuery({
    storeId,
  });
  return (
    <AdminLayout>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {isLoading && <PageLoader />}

          {!isLoading && store && <SettingsForm initialData={store} />}
        </div>
      </div>
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default SettingsPage;
