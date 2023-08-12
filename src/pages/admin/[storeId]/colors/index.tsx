import { format } from "date-fns";
import { useCallback, useEffect, useState, type FC } from "react";

import type { Color } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import type { ColorColumn } from "~/components/admin/colors/columns";
import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";

import { ColorClient } from "~/components/admin/colors/client";
import PageLoader from "~/components/ui/page-loader";
import AdminLayout from "~/layouts/AdminLayout";

interface IProps {
  storeId: string;
}

const ColorsPage: FC<IProps> = ({ storeId }) => {
  const [formattedColors, setFormattedColors] = useState<ColorColumn[]>([]);

  const { data: colors } = api.colors.getAllColors.useQuery({
    storeId,
  });

  const formatColors = useCallback((colors: Color[]) => {
    return colors.map((item: Color) => ({
      id: item.id,
      name: item.name,
      value: item.value,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));
  }, []);

  useEffect(() => {
    if (colors) setFormattedColors(formatColors(colors) as ColorColumn[]);
  }, [colors, formatColors]);

  return (
    <AdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {!colors && <PageLoader />}
          {colors && <ColorClient data={formattedColors} />}
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

export default ColorsPage;
