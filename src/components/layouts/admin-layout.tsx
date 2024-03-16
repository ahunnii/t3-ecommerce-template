/* eslint-disable react-hooks/exhaustive-deps */
import Link from "next/link";
import { useEffect } from "react";
import { SEO } from "~/components/common/seo-head";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import StoreSwitcher from "~/modules/admin/components/store-switcher";

import { MainNav } from "~/modules/navigation/admin/main-nav";
import Navbar from "~/modules/navigation/admin/navbar";

import { api } from "~/utils/api";

interface IProps {
  children: React.ReactNode;
  metadata?: {
    title: string;
    description: string;
  };
}
const AdminLayout = ({ children, metadata }: IProps) => {
  const getAllStores = api.store.getAllStores.useQuery(void 0, {
    enabled: false,
  });

  useEffect(() => {
    void getAllStores.refetch();
  }, []);

  return (
    <>
      <SEO
        title={metadata?.title ?? `Admin Template Site`}
        description={metadata?.description ?? "Lorem Ipsum"}
      />
      <div className="fixed grid h-svh w-full overflow-hidden  bg-slate-100/50 lg:grid-cols-[280px_1fr]">
        <div className="fixed inset-0 z-10 hidden h-full translate-x-0 transform overflow-auto border-r bg-gray-100/40 transition-transform duration-200 ease-in-out dark:bg-gray-800/40 lg:static lg:z-auto lg:block lg:translate-x-0">
          <div className="flex h-full max-h-svh flex-col gap-2">
            <div className="flex h-[60px] items-center border-b px-6">
              {getAllStores?.data && (
                <StoreSwitcher items={getAllStores.data} />
              )}
            </div>
            <div className="flex-1 overflow-auto py-2">
              <MainNav className="grid items-start px-4 text-sm font-medium lg:space-x-0" />
            </div>
            <div className="mt-auto p-4">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>Need Some Help?</CardTitle>
                  <CardDescription>
                    Check out your site documentation below or email us.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    prefetch={false}
                    href="https://artisan-ecommerce-docs.vercel.app"
                  >
                    <Button className="w-full">View Docs</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <main className="flex h-svh flex-col overflow-y-auto">
          <div className=" sticky top-0 z-20 flex items-center gap-4 bg-white px-4">
            <Navbar stores={getAllStores.data ?? []} />
          </div>
          <div className="flex h-full flex-col bg-gray-50/25 dark:bg-slate-900">
            <div className="relative flex-1">{children}</div>
          </div>
          {/* <ScrollArea className="h-[calc(100vh-70px)] "></ScrollArea> */}
          {/* <>{children}</> */}
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
