import { api } from "~/utils/api";

import type { GetServerSidePropsContext } from "next";

import type { Size } from "@prisma/client";
import { useRouter } from "next/router";
import { FC } from "react";
import { SizeForm } from "~/components/admin/sizes/size-form";
import AdminLayout from "~/layouts/AdminLayout";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

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
      sizeId: ctx.query.sizeId,
    },
  };
}

interface IProps {
  sizeId: string;
}

const SizePage: FC<IProps> = ({ sizeId }) => {
  const { data: size } = api.sizes.getSize.useQuery({
    sizeId: sizeId,
  });

  return (
    <AdminLayout>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {size && <SizeForm initialData={size} />}
          {!size && <SizeForm initialData={null} />}
        </div>
      </div>
    </AdminLayout>
  );
};

export default SizePage;
