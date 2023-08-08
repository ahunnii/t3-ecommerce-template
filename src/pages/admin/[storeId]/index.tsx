import { GetStaticPropsContext, type GetServerSidePropsContext } from "next";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { ReactElement, useEffect } from "react";
import { useStoreModal } from "~/hooks/use-store-modal";

import { CreditCard, DollarSign, Package } from "lucide-react";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

import { getGraphRevenue } from "~/actions/get-graph-revenue";
import { getSalesCount } from "~/actions/get-sales-count";
import { getStockCount } from "~/actions/get-stock-count";
import { getTotalRevenue } from "~/actions/get-total-revenue";
import { Overview } from "~/components/admin/overview";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";
import { formatter } from "~/utils/styles";

// export async function getServerSideProps(ctx: GetServerSidePropsContext) {
//   const session = await getServerAuthSession(ctx);

//   const { params } = ctx;

//   if (!session || !session.user) {
//     return {
//       redirect: {
//         destination: "/auth/signin",
//         permanent: false,
//       },
//     };
//   }

//   const userId = session.user.id;

//   const store = await prisma.store.findFirst({
//     where: {
//       id: ctx?.params?.storeId.toString() ?? "-1",
//       userId,
//     },
//   });

//   if (store) {
//     console.log("redirecting to store", store.id);

//     return {
//       redirect: {
//         destination: `/admin/${store.id.toString()}`,
//         permanent: false,
//       },
//     };
//     // redirect(`/admin/${store.id.toString()}`);
//   }

//   return {
//     props: {},
//   };
// }

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
  const storeId = ctx.params?.storeId.toString();
  const totalRevenue = await getTotalRevenue(storeId);
  const graphRevenue = await getGraphRevenue(storeId);
  const salesCount = await getSalesCount(storeId);
  const stockCount = await getStockCount(storeId);
  return {
    props: {
      totalRevenue,
      graphRevenue,
      salesCount,
      stockCount,
      params: {
        storeId,
      },
    },
    revalidate: 60, // This is the ISR part; the page will be regenerated every 60 seconds if there's a request.
  };
};

export const getStaticPaths = async () => {
  const stores = await prisma.store.findMany({
    select: {
      id: true,
    },
  });

  const paths = stores.map((store) => ({
    params: { storeId: store.id.toString() },
  }));

  return {
    paths,
    fallback: "blocking", // Or 'true', depending on your use-case. 'blocking' will server-render on-demand.
  };
};

interface DashboardPageProps {
  totalRevenue: number;
  graphRevenue: any; // define proper type
  salesCount: number;
  stockCount: number;
  params: {
    storeId: string;
  };
}

const DashboardPage = ({
  totalRevenue,
  graphRevenue,
  salesCount,
  stockCount,
  params,
}: DashboardPageProps) => {
  return (
    <div className="flex-col">
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
  );
};

export default DashboardPage;
