import type { GetServerSidePropsContext } from "next";
import Link from "next/link";
import type { FC } from "react";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { BackToButton } from "~/components/common/buttons/back-to-button";
import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";

import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";

import { Pencil } from "lucide-react";
import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import AdminLayout from "~/components/layouts/admin-layout";
import { ViewBillboard } from "~/modules/billboards/admin/view-billboard";

interface IProps {
  billboardId: string;
}

const BillboardPage: FC<IProps> = ({ billboardId }) => {
  const { data: billboard, isLoading } = api.billboards.getBillboard.useQuery({
    billboardId,
  });

  const editBillboardURL = `/admin/${billboard?.storeId}/billboards/${billboard?.id}/edit`;
  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}

      <div className="flex-1 space-y-4 p-8 pt-6">
        {!isLoading && billboard && (
          <>
            <BackToButton
              link={`/admin/${billboard.storeId}/billboards`}
              title="Back to Billboards"
            />
            <div className="flex w-full items-center justify-between">
              <Heading
                title={billboard.label}
                description={billboard.description ?? "No description added"}
              />
              <Link href={editBillboardURL}>
                <Button className="flex gap-2" size={"sm"}>
                  <Pencil className="h-5 w-5" /> Edit Billboard
                </Button>
              </Link>
            </div>
            {billboard && <ViewBillboard billboard={billboard} />}
          </>
        )}
        {!billboard && !isLoading && (
          <DataFetchErrorMessage message="There seems to be an issue with loading the billboard" />
        )}
      </div>
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx, (ctx) => {
    return {
      props: {
        billboardId: ctx.query.billboardId,
      },
    };
  });
}

export default BillboardPage;
