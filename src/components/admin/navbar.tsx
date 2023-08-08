// import { UserButton, auth } from "@clerk/nextjs";
import { getSession, signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { MainNav } from "~/components/admin/main-nav";
import StoreSwitcher from "~/components/admin/store-switcher";
import { ThemeToggle } from "~/components/admin/theme-toggle";
import { prisma } from "~/server/db";

import type { Store } from "@prisma/client";
const Navbar = async () => {
  const session = await getSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const userId = session?.user?.id;

  const stores: Array<Store> = await prisma.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          {/* <UserButton afterSignOutUrl="/" /> */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
