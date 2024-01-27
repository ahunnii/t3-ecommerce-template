import type { GetServerSidePropsContext } from "next";
import Link from "next/link";
import type { FC } from "react";

import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";

import { BackToButton } from "~/components/common/buttons/back-to-button";
import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";
import Billboard from "~/components/core/ui/billboard";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";

import AdminLayout from "~/components/layouts/AdminLayout";

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
      {isLoading ?? <AbsolutePageLoader />}
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {!isLoading && !billboard && <div>Something happened</div>}
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
                  <Button> Edit Billboard</Button>
                </Link>
              </div>
              <div className="w-full rounded-md border border-border bg-background/50 p-4">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                  Preview
                </h3>
                <p className="text-sm text-muted-foreground">
                  This is what is shown at the top of each collections page.
                </p>

                {billboard && (
                  <Billboard data={billboard} textStyle="text-white" />
                )}
              </div>
            </>
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
