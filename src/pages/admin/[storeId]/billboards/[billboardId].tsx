import { BillboardForm } from "~/components/admin/billboards/billboard-form";

import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import AdminLayout from "~/layouts/AdminLayout";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

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
      billboardId: ctx.query.billboardId,
    },
  };
}
interface IProps {
  billboardId: string;
}

const BillboardPage: FC<IProps> = ({ billboardId }) => {
  const { data: billboard } = api.billboards.getBillboard.useQuery({
    billboardId,
  });
  return (
    <AdminLayout>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {billboard && <BillboardForm initialData={billboard} />}
          {!billboard && <BillboardForm initialData={null} />}
        </div>
      </div>
    </AdminLayout>
  );
};

export default BillboardPage;
