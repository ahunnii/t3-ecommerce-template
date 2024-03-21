import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";

import Container from "~/components/common/layout/container";
import MainNav from "~/components/common/layout/main-nav";
import NavbarActions from "~/components/common/layout/navbar-actions";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";
import { cn } from "~/utils/styles";

export const Navbar: FC<{
  navStyles?: string;
  linkStyles?: string;
}> = ({ navStyles = "" }) => {
  const { data: categories } = api.collections.getAllCollections.useQuery({
    isFeatured: true,
  });

  const { data: collections } = api.collections.getAllCollections.useQuery({
    storeId: env.NEXT_PUBLIC_STORE_ID,
  });

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-50 w-full border-b bg-white",
        navStyles
      )}
    >
      <Container>
        <div className="relative flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="ml-4 flex gap-x-2 lg:ml-0">
            <p className="sr-only text-xl font-bold">
              {env.NEXT_PUBLIC_STORE_NAME}
            </p>

            <>
              <Image
                src={`/${env.NEXT_PUBLIC_STORE_TYPE}/logo.png`}
                width={50}
                height={50}
                alt="logo"
              />
            </>
          </Link>
          {categories && collections && (
            <MainNav data={categories} collections={collections} />
          )}
          <NavbarActions />
        </div>
      </Container>
    </div>
  );
};
