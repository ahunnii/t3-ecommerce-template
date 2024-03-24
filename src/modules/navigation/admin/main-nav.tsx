import Link from "next/link";
import { useRouter } from "next/router";
import type { FC, HTMLAttributes } from "react";
import { api } from "~/utils/api";

import { cn } from "~/utils/styles";
import { Badge } from "../../../components/ui/badge";

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
  const { data: orders } = api.orders.getAllOrders.useQuery({
    storeId,
    searchParams: { isShipped: false },
  });

  const { data: customOrders } =
    api.customOrder.getPendingCustomRequests.useQuery({
      storeId,
    });

  const encodedStoreId = encodeURIComponent(storeId);

  if (!storeId) return null;

  const routes: Route[] = [
    {
      href: `/admin/${encodedStoreId}`,
      label: "Dashboard",
      active: asPath === `/admin/${encodedStoreId}`,
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
      href: `/admin/${encodedStoreId}/custom-orders`,
      label: `Custom Requests`,
      active: asPath === `/admin/${encodedStoreId}/custom-orders`,
    },
    {
      href: `/admin/${encodedStoreId}/blog-posts`,
      label: "Blog Posts",
      active: asPath === `/admin/${encodedStoreId}/blog-posts`,
    },
    {
      href: `/admin/${encodedStoreId}/gallery`,
      label: "Gallery",
      active: asPath === `/admin/${encodedStoreId}/gallery`,
    },
    {
      href: `/admin/${encodedStoreId}/discounts`,
      label: `Discounts`,
      active: asPath === `/admin/${encodedStoreId}/discounts`,
    },
    {
      href: `/admin/${encodedStoreId}/orders`,
      label: `Orders`,
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
            "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
          // className={cn(
          //   "text-sm font-medium transition-colors hover:text-primary",
          //   route.active
          //     ? "text-black dark:text-white"
          //     : "text-muted-foreground"
          // )}
        >
          {route.label}

          {route.label === "Orders" && <Badge>{orders?.length ?? 0}</Badge>}

          {route.label === "Custom Requests" && (
            <Badge>{customOrders ?? 0}</Badge>
          )}
        </Link>
      ))}
    </nav>
  );
};
