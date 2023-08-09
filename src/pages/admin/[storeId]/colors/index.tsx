import { format } from "date-fns";
import { api } from "~/utils/api";

import type { GetServerSidePropsContext } from "next";

import { Color } from "@prisma/client";
import { useEffect, useState } from "react";
import { ColorClient } from "~/components/admin/colors/client";
import type { ColorColumn } from "~/components/admin/colors/columns";
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
      params: ctx.query,
    },
  };
}

const ColorsPage = ({ params }: { params: { storeId: string } }) => {
  const [formattedColors, setFormattedColors] = useState<ColorColumn[]>([]);

  const { data: colors } = api.colors.getAllColors.useQuery({
    storeId: params?.storeId,
  });

  //   const formattedColors: ColorColumn[] = colors.map((item) => ({
  //     id: item.id,
  //     name: item.name,
  //     value: item.value,
  //     createdAt: format(item.createdAt, "MMMM do, yyyy"),
  //   }));
  useEffect(() => {
    if (colors) {
      setFormattedColors(
        colors?.map((item: Color) => ({
          id: item.id,
          name: item.name,
          value: item.value,
          createdAt: format(item.createdAt, "MMMM do, yyyy"),
        }))
      );
    }
  }, [colors]);
  return (
    <AdminLayout>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <ColorClient data={formattedColors} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default ColorsPage;
