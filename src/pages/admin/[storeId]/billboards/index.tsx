import { format } from "date-fns";

import { BillboardClient } from "~/components/admin/billboards/client";
import type { BillboardColumn } from "~/components/admin/billboards/columns";
import { api } from "~/utils/api";

import type { GetServerSidePropsContext } from "next";

import type { Billboard } from "@prisma/client";
import { useEffect, useState } from "react";

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

const BillboardsPage = ({ params }: { params: { storeId: string } }) => {
  const [formattedBillboards, setFormattedBillboards] = useState<
    BillboardColumn[]
  >([]);
  const { data: billboards } = api.billboards.getAllBillboards.useQuery({
    storeId: params?.storeId,
  });

  // const billboards = await prismadb.billboard.findMany({
  //   where: {
  //     storeId: params.storeId,
  //   },
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  // });

  // const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
  //   id: item.id,
  //   label: item.label,
  //   createdAt: format(item.createdAt, "MMMM do, yyyy"),
  // }));
  useEffect(() => {
    if (billboards) {
      setFormattedBillboards(
        billboards?.map((item: Billboard) => ({
          id: item.id,
          label: item.label,
          createdAt: format(item.createdAt, "MMMM do, yyyy"),
        }))
      );
    }
  }, [billboards]);
  return (
    <AdminLayout>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <BillboardClient data={formattedBillboards} />
        </div>
      </div>{" "}
    </AdminLayout>
  );
};

export default BillboardsPage;
