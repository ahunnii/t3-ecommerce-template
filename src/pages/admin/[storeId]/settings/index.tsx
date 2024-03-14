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
    includeContent: true,
    includeSocials: true,
  });
  return (
    <AdminLayout>
      {isLoading && <PageLoader />}
      {!isLoading && store && <SettingsForm initialData={store} />}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default SettingsPage;
