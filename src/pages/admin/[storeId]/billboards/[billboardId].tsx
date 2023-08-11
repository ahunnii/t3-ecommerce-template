import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";

import { BillboardForm } from "~/components/admin/billboards/billboard-form";
import PageLoader from "~/components/ui/page-loader";
import AdminLayout from "~/layouts/AdminLayout";

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
          {typeof billboard === "undefined" && <PageLoader />}
          {typeof billboard === "object" && (
            <BillboardForm initialData={billboard && null} />
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
      billboardId: ctx.query.billboardId,
    },
  };
}

export default BillboardPage;
