import { redirect } from "next/navigation";
import { prisma } from "~/server/db";

import { Store } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { FC } from "react";
import { SettingsForm } from "~/components/admin/settings/settings-form";
import AdminLayout from "~/layouts/AdminLayout";
import { getServerAuthSession } from "~/server/auth";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const userId = session.user.id;

  const store = await prisma.store.findFirst({
    where: {
      id: ctx.query.storeId as string,
      userId,
    },
  });

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

interface IProps {
  store: Store;
}
const SettingsPage: FC<IProps> = ({ store }) => {
  return (
    <AdminLayout>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <SettingsForm initialData={store} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
