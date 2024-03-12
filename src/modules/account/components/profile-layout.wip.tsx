import { useSession } from "next-auth/react";

import Container from "~/components/core/ui/container";
import { SidebarNav } from "~/modules/account/core/sidebar-nav";

import { Separator } from "~/components/ui/separator";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import StorefrontLayout from "~/components/layouts/storefront-layout";
import { storeTheme } from "~/data/config.custom";
import { env } from "~/env.mjs";
import { cn } from "~/utils/styles";
import { ACCOUNT_NAV_ITEMS } from "../data";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const metadata = {
  title: `Account - ${env.NEXT_PUBLIC_STORE_NAME}`,
  description:
    "Manage your account settings, view your order history, and more.",
};

export default function ProfileLayout({ children }: SettingsLayoutProps) {
  const { status } = useSession();

  return (
    <StorefrontLayout {...storeTheme.layout} metadata={metadata}>
      {status === "loading" ? (
        <AbsolutePageLoader />
      ) : (
        <Container>
          <div className=" block space-y-6 px-8 py-10 pb-16">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 ">
                <h2 className="text-2xl font-bold tracking-tight text-black">
                  My Account
                </h2>
                <p className="text-muted-foreground">
                  Manage your account settings, view your order history, and
                  more.
                </p>
              </div>
            </div>
            <Separator className="my-6 bg-zinc-900" />
            <div className="flex w-full flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
              <aside className="-mx-4 lg:w-1/5">
                <SidebarNav
                  items={ACCOUNT_NAV_ITEMS}
                  className={cn(" text-black")}
                />
              </aside>
              <div className="flex-1 lg:mx-6 ">{children}</div>
            </div>
          </div>
        </Container>
      )}
    </StorefrontLayout>
  );
}
