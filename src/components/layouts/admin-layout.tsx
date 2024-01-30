import StoreSwitcher from "~/components/admin/store-switcher";
import { SEO } from "~/components/core/seo-head";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";

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
  const { data: stores } = api.store.getAllStores.useQuery();
  return (
    <>
      <SEO
        title={metadata?.title ?? `Admin Template Site`}
        description={metadata?.description ?? "Lorem Ipsum"}
      />
      <div className="grid h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
        <div className="fixed inset-0 z-10 hidden h-full translate-x-0 transform overflow-auto border-r bg-gray-100/40 transition-transform duration-200 ease-in-out dark:bg-gray-800/40 lg:static lg:z-auto lg:block lg:translate-x-0">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-[60px] items-center border-b px-6">
              {stores && <StoreSwitcher items={stores} />}
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
                  <Button className="w-full">View Docs</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <main className="flex h-screen flex-col overflow-y-auto">
          <div className="flex items-center gap-4 px-4">
            <Navbar />
          </div>
          <ScrollArea className="h-[calc(100vh-100px)]">{children}</ScrollArea>
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
