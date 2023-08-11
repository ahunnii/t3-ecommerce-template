import { format } from "date-fns";
import { useCallback, useEffect, useState, type FC } from "react";

import type { Size } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import type { SizeColumn } from "~/components/admin/sizes/columns";

import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";

import { SizesClient } from "~/components/admin/sizes/client";
import PageLoader from "~/components/ui/page-loader";
import AdminLayout from "~/layouts/AdminLayout";

interface IProps {
  storeId: string;
}

const SizesPage: FC<IProps> = ({ storeId }) => {
  const [formattedSizes, setFormattedSizes] = useState<SizeColumn[]>([]);

  const { data: sizes } = api.sizes.getAllSizes.useQuery({
    storeId,
  });

  const formatSizes = useCallback((sizes: Size[]) => {
    return sizes.map((item: Size) => ({
      id: item.id,
      name: item.name,
      value: item.value,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));
  }, []);

  useEffect(() => {
    if (sizes) setFormattedSizes(formatSizes(sizes) as SizeColumn[]);
  }, [sizes, formatSizes]);

  return (
    <AdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {!sizes && <PageLoader />}
          {sizes && <SizesClient data={formattedSizes} />}
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
export default SizesPage;
