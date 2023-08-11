import { format } from "date-fns";
import { useCallback, useEffect, useState, type FC } from "react";

import type { Billboard } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import type { BillboardColumn } from "~/components/admin/billboards/columns";

import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";

import { BillboardClient } from "~/components/admin/billboards/client";
import PageLoader from "~/components/ui/page-loader";
import AdminLayout from "~/layouts/AdminLayout";

interface IProps {
  storeId: string;
}

const BillboardsPage: FC<IProps> = ({ storeId }) => {
  const [formattedBillboards, setFormattedBillboards] = useState<
    BillboardColumn[]
  >([]);
  const { data: billboards } = api.billboards.getAllBillboards.useQuery({
    storeId,
  });

  const formatBillboards = useCallback((billboards: Billboard[]) => {
    return billboards.map((item: Billboard) => ({
      id: item.id,
      label: item.label,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));
  }, []);

  useEffect(() => {
    if (billboards) {
      setFormattedBillboards(formatBillboards(billboards) as BillboardColumn[]);
    }
  }, [billboards, formatBillboards]);

  return (
    <AdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {!billboards && <PageLoader />}
          {billboards && <BillboardClient data={formattedBillboards} />}
        </div>
      </div>{" "}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const store = await authenticateSession(ctx);

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
      storeId: ctx.query.storeId,
    },
  };
}

export default BillboardsPage;
