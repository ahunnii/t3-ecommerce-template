"use client";

import type { Size } from "@prisma/client";
import { format } from "date-fns";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";

import { SizesClient } from "~/components/admin/sizes/client";
import type { SizeColumn } from "~/components/admin/sizes/columns";
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
      params: ctx.query,
    },
  };
}

const SizesPage = ({ params }: { params: { storeId: string } }) => {
  const [formattedSizes, setFormattedSizes] = useState<SizeColumn[]>([]);

  const { data: sizes } = api.sizes.getAllSizes.useQuery({
    storeId: params?.storeId,
  });

  useEffect(() => {
    if (sizes) {
      setFormattedSizes(
        sizes?.map((item: Size) => ({
          id: item.id,
          name: item.name,
          value: item.value,
          createdAt: format(item.createdAt, "MMMM do, yyyy"),
        }))
      );
    }
  }, [sizes]);

  // const formattedSizes: SizeColumn[] = sizes?.map((item: Size) => ({
  //   id: item.id,
  //   name: item.name,
  //   value: item.value,
  //   createdAt: format(item.createdAt, "MMMM do, yyyy"),
  // }));

  return (
    <AdminLayout>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <SizesClient data={formattedSizes} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default SizesPage;
