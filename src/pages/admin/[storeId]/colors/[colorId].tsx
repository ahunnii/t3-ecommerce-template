import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";

import { ColorForm } from "~/components/admin/colors/color-form";
import PageLoader from "~/components/ui/page-loader";
import AdminLayout from "~/layouts/AdminLayout";

interface IProps {
  colorId: string;
}
const ColorPage: FC<IProps> = ({ colorId }) => {
  const { data: color } = api.colors.getColor.useQuery({
    colorId,
  });

  return (
    <AdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {typeof color === "undefined" && <PageLoader />}
          {typeof color === "object" && (
            <ColorForm initialData={color ?? null} />
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
      colorId: ctx.query.colorId,
    },
  };
}

export default ColorPage;
