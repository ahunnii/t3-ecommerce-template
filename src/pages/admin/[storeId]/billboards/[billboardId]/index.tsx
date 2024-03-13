import type { GetServerSidePropsContext } from "next";
import Link from "next/link";
import type { FC } from "react";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";

import { Button } from "~/components/ui/button";

import { Pencil } from "lucide-react";
import { AdminFormBody } from "~/components/common/admin/admin-form-body";
import { AdminFormHeader } from "~/components/common/admin/admin-form-header";
import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import AdminLayout from "~/components/layouts/admin-layout";
import { ViewBillboard } from "~/modules/billboards/components/admin/view-billboard";

interface IProps {
  billboardId: string;
}

const BillboardPage: FC<IProps> = ({ billboardId }) => {
  const getBillboard = api.billboards.getBillboard.useQuery({
    billboardId,
  });

  const billboard = getBillboard.data;
  const isLoading = getBillboard.isLoading;

  const editBillboardURL = `/admin/${billboard?.storeId}/billboards/${billboard?.id}/edit`;
  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}

      <>
        {!isLoading && billboard && (
          <>
            <AdminFormHeader
              title={billboard.label}
              description={
                "View how your billboard will appear to your customers."
              }
              contentName="Billboards"
              link={`/admin/${billboard.storeId}/billboards`}
            >
              <Link href={editBillboardURL}>
                <Button className="flex gap-2" size={"sm"}>
                  <Pencil className="h-5 w-5" /> Edit...
                </Button>
              </Link>
            </AdminFormHeader>

            <AdminFormBody className="flex-col ">
              <ViewBillboard billboard={billboard} />
            </AdminFormBody>
          </>
        )}
        {!billboard && !isLoading && (
          <DataFetchErrorMessage message="There seems to be an issue with loading the billboard" />
        )}
      </>
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
