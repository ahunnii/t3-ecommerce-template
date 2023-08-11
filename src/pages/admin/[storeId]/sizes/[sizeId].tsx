import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";

import { SizeForm } from "~/components/admin/sizes/size-form";
import PageLoader from "~/components/ui/page-loader";
import AdminLayout from "~/layouts/AdminLayout";

interface IProps {
  sizeId: string;
}

const SizePage: FC<IProps> = ({ sizeId }) => {
  const { data: size } = api.sizes.getSize.useQuery({
    sizeId: sizeId,
  });

  return (
    <AdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {typeof size === "undefined" && <PageLoader />}
          {typeof size === "object" && <SizeForm initialData={size && null} />}
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
      sizeId: ctx.query.sizeId,
    },
  };
}

export default SizePage;
