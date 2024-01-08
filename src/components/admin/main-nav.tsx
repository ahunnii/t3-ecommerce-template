import Link from "next/link";
import { useRouter } from "next/router";
import type { FC, HTMLAttributes } from "react";

import { cn } from "~/utils/styles";

interface Route {
  href: string;
  label: string;
  active: boolean;
}

interface MainNavProps extends HTMLAttributes<HTMLElement> {
  className?: string;
}

export const MainNav: FC<MainNavProps> = ({ className, ...props }) => {
  const { asPath, query } = useRouter();
  const { storeId } = query as { storeId: string };

  const encodedStoreId = encodeURIComponent(storeId);

  if (!storeId) return null;

  const routes: Route[] = [
    {
      href: `/admin/${encodedStoreId}`,
      label: "Overview",
      active: asPath === `/admin/${encodedStoreId}`,
    },
    {
      href: `/admin/${encodedStoreId}/billboards`,
      label: "Billboards",
      active: asPath === `/admin/${encodedStoreId}/billboards`,
    },
    {
      href: `/admin/${encodedStoreId}/categories`,
      label: "Categories",
      active: asPath === `/admin/${encodedStoreId}/categories`,
    },
    {
      href: `/admin/${encodedStoreId}/collections`,
      label: "Collections",
      active: asPath === `/admin/${encodedStoreId}/collections`,
    },
    {
      href: `/admin/${encodedStoreId}/products`,
      label: "Products",
      active: asPath === `/admin/${encodedStoreId}/products`,
    },
    {
      href: `/admin/${encodedStoreId}/orders`,
      label: "Orders",
      active: asPath === `/admin/${encodedStoreId}/orders`,
    },
    {
      href: `/admin/${encodedStoreId}/settings`,
      label: "Settings",
      active: asPath === `/admin/${encodedStoreId}/settings`,
    },
  ];

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};
