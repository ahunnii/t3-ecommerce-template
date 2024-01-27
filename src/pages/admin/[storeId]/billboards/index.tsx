import type { GetServerSidePropsContext } from "next";
import { useCallback, useEffect, useState, type FC } from "react";

import type { Billboard } from "@prisma/client";
import { format } from "date-fns";

import PageLoader from "~/components/ui/page-loader";
import { BillboardClient } from "~/modules/billboards/admin/client";
import type { BillboardColumn } from "~/modules/billboards/admin/columns";

import AdminLayout from "~/components/layouts/AdminLayout";

import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";

interface IProps {
  storeId: string;
}

const BillboardsPage: FC<IProps> = ({ storeId }) => {
  const [formattedBillboards, setFormattedBillboards] = useState<
    BillboardColumn[]
  >([]);
  const { data: billboards, isLoading } =
    api.billboards.getAllBillboards.useQuery({
      storeId,
    });

  const formatBillboards = useCallback(
    (billboards: Billboard[]) => {
      return billboards.map((item: Billboard) => ({
        id: item.id,
        storeId: storeId,
        label: item.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
      }));
    },
    [storeId]
  );

  useEffect(() => {
    if (billboards) setFormattedBillboards(formatBillboards(billboards));
  }, [billboards, formatBillboards]);

  return (
    <AdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {isLoading ? (
            <PageLoader />
          ) : (
            <BillboardClient data={formattedBillboards} />
          )}
        </div>
      </div>
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
