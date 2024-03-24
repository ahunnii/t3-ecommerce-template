import { CreditCard, DollarSign, Mail, Package } from "lucide-react";
import Head from "next/head";

import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { getGraphRevenue } from "~/modules/admin-overview/actions/get-graph-revenue";
import { getSalesCount } from "~/modules/admin-overview/actions/get-sales-count";
import { getStockCount } from "~/modules/admin-overview/actions/get-stock-count";
import { getTotalRevenue } from "~/modules/admin-overview/actions/get-total-revenue";

import { authenticateAdminOrOwner } from "~/utils/auth";
import { formatter } from "~/utils/styles";

import AdminLayout from "~/components/layouts/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";
import { Overview } from "~/modules/admin-overview/components/overview";
import { RecentOrders } from "~/modules/admin-overview/components/recent-orders";
import { Order } from "~/modules/orders/types";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

interface DashboardPageProps {
  totalRevenue: number;
  // getRecentOrders: Order[];
  compareFromLastMonthRevenue: number;
  graphRevenue: Array<{
    name: string;
    total: number;
  }>;
  salesCount: number;
  stockCount: number;
}

const DashboardPage: FC<DashboardPageProps> = ({
  totalRevenue,
  // compareFromLastMonthRevenue,
  // getRecentOrders,
  graphRevenue,
  salesCount,
  stockCount,
}) => {
  const { data: orders } = api.orders.getAllPendingOrders.useQuery({});
  const { data: saleCount } = api.orders.getMonthlyOrderCount.useQuery({});
  return (
    <>
      <AdminLayout>
        <div className="mx-auto max-w-7xl space-y-4 p-8">
          <div className="flex items-center justify-between">
            <Heading title="Dashboard" description="Overview of your store" />
          </div>
          <Separator />
          <>
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview data={graphRevenue} />
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>New Sales</CardTitle>
                  <CardDescription>
                    You made total {salesCount} sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentOrders data={orders ?? []} />
                </CardContent>
              </Card>
            </div>
          </>
        </div>
      </AdminLayout>
    </>
  );
};

const getStoreStats = async (ctx: GetServerSidePropsContext) => {
  const storeId = ctx.query.storeId as string;

  const totalRevenue = await getTotalRevenue(storeId);
  const compareFromLastMonthRevenue = await getTotalRevenue(storeId, true);
  const graphRevenue = await getGraphRevenue(storeId);
  const salesCount = await getSalesCount(storeId);
  const stockCount = await getStockCount(storeId);

  return {
    props: {
      totalRevenue,
      compareFromLastMonthRevenue,
      graphRevenue,
      salesCount,
      stockCount,
      // getRecentOrders,
    },
  };
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx, getStoreStats);
}

export default DashboardPage;
