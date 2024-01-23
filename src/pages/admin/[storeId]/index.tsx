import { CreditCard, DollarSign, Package } from "lucide-react";
import Head from "next/head";

import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { getGraphRevenue } from "~/modules/admin-overview/actions/get-graph-revenue";
import { getSalesCount } from "~/modules/admin-overview/actions/get-sales-count";
import { getStockCount } from "~/modules/admin-overview/actions/get-stock-count";
import { getTotalRevenue } from "~/modules/admin-overview/actions/get-total-revenue";

import { authenticateSession } from "~/utils/auth";
import { formatter } from "~/utils/styles";

import { Overview } from "~/components/admin/overview";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";
import AdminLayout from "~/layouts/AdminLayout";

interface DashboardPageProps {
  totalRevenue: number;
  graphRevenue: Array<{
    name: string;
    total: number;
  }>;
  salesCount: number;
  stockCount: number;
}

const DashboardPage: FC<DashboardPageProps> = ({
  totalRevenue,
  graphRevenue,
  salesCount,
  stockCount,
}) => {
  return (
    <>
      <Head>
        {/* <title>Store Dashboard</title> */}
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AdminLayout>
        <div className="flex h-full flex-col">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <Heading title="Dashboard" description="Overview of your store" />
            <Separator />
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatter.format(totalRevenue)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sales</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{salesCount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Products In Stock
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stockCount}</div>
                </CardContent>
              </Card>
            </div>
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={graphRevenue} />
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const store = await authenticateSession(ctx);
  const storeId = ctx.query.storeId as string;

  const totalRevenue = await getTotalRevenue(storeId);
  const graphRevenue = await getGraphRevenue(storeId);
  const salesCount = await getSalesCount(storeId);
  const stockCount = await getStockCount(storeId);

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
      totalRevenue,
      graphRevenue,
      salesCount,
      stockCount,
    },
  };
}

export default DashboardPage;
