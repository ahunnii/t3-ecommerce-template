import type { Store } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { authenticateSession } from "~/utils/auth";

import { SettingsForm } from "~/components/admin/settings/settings-form";
import PageLoader from "~/components/ui/page-loader";
import AdminLayout from "~/layouts/AdminLayout";

interface IProps {
  store: Store & { gallery: { url: string }[] };
}
const SettingsPage: FC<IProps> = ({ store }) => {
  return (
    <AdminLayout>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {!store && <PageLoader />}

          {store && <SettingsForm initialData={store} />}
        </div>
      </div>
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const store = (await authenticateSession(ctx)) as Store;

  if (!store) {
    return {
      redirect: {
        destination: `/admin`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      store: {
        ...store,

        createdAt: store.createdAt.toISOString(),
        updatedAt: store.updatedAt.toISOString(),
      },
    },
  };
}

export default SettingsPage;
