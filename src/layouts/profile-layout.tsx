import { useSession } from "next-auth/react";
import Head from "next/head";

import { useMemo } from "react";

import { SidebarNav } from "~/components/core/profile/sidebar-nav";
import Container from "~/components/core/ui/container";

import PageLoader from "~/components/ui/page-loader";
import { Separator } from "~/components/ui/separator";

import StorefrontLayout from "./storefront-layout";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: SettingsLayoutProps) {
  const { status } = useSession();

  const navItems = useMemo(() => {
    return [
      {
        title: "Profile",
        href: "/profile",
      },

      {
        title: "Survey",
        href: "/profile/survey",
      },
    ];
  }, []);

  return (
    <>
      <Head>
        <title>Profile | Artisanal Futures</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <StorefrontLayout>
        {status === "loading" ? (
          <PageLoader />
        ) : (
          <Container>
            <div className=" block space-y-6 py-5 pb-16">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 ">
                  <h2 className="text-2xl font-bold tracking-tight">
                    Settings
                  </h2>
                  <p className="text-muted-foreground">
                    Manage your account settings , shop settings, and update
                    preferences.
                  </p>
                </div>
              </div>
              <Separator className="my-6" />
              <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:w-1/5">
                  <SidebarNav items={navItems} />
                </aside>
                <div className="mx-6 flex-1 lg:max-w-2xl">{children}</div>
              </div>
            </div>
          </Container>
        )}
      </StorefrontLayout>
    </>
  );
}
