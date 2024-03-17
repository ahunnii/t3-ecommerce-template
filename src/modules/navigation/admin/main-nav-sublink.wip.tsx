import Link from "next/link";
import { useRouter } from "next/router";
import type { FC, HTMLAttributes } from "react";
import { api } from "~/utils/api";

import { indexOf } from "lodash";
import {
  Boxes,
  CornerDownRight,
  Home,
  Image,
  Inbox,
  LucideIcon,
  Settings,
  Shirt,
  StickyNote,
  Tags,
} from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/utils/styles";
import { Badge } from "../../../components/ui/badge";
import { Route } from "./types";

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

  const { data: customOrders } = api.customOrder.getCustomRequests.useQuery({
    storeId,
  });

  const encodedStoreId = encodeURIComponent(storeId);

  if (!storeId) return null;

  const routes: Route[] = [
    {
      href: `/admin/${encodedStoreId}`,
      label: "Overview",
      active: asPath === `/admin/${encodedStoreId}`,
      Icon: Home,
    },

    {
      href: `/admin/${encodedStoreId}/orders`,
      label: `Orders`,
      active: asPath === `/admin/${encodedStoreId}/orders`,
      Icon: Inbox,
      subRoutes: [
        {
          href: `/admin/${encodedStoreId}/shipping`,
          label: `Shipping Labels`,
          active: asPath === `/admin/${encodedStoreId}/shipping`,
        },
      ],
    },

    {
      href: `/admin/${encodedStoreId}/products`,
      label: "Products",
      active: asPath === `/admin/${encodedStoreId}/products`,
      Icon: Shirt,
      subRoutes: [
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
      ],
    },

    {
      href: `/admin/${encodedStoreId}/discounts`,
      label: `Discounts`,
      active: asPath === `/admin/${encodedStoreId}/discounts`,
      Icon: Tags,
    },

    {
      href: `/admin/${encodedStoreId}/custom-orders`,
      label: `Custom Requests`,
      active: asPath === `/admin/${encodedStoreId}/custom-orders`,
      Icon: Boxes,
    },
    {
      href: `/admin/${encodedStoreId}/blog-posts`,
      label: "Blog Posts",
      active: asPath === `/admin/${encodedStoreId}/blog-posts`,
      Icon: StickyNote,
    },
    {
      href: `/admin/${encodedStoreId}/gallery`,
      label: "Gallery",
      active: asPath === `/admin/${encodedStoreId}/gallery`,
      Icon: Image,
    },

    {
      href: `/admin/${encodedStoreId}/settings`,
      label: "Settings",
      active: asPath === `/admin/${encodedStoreId}/settings`,
      Icon: Settings,
    },
  ];

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <>
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "relative flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
              route.active
                ? "text-black dark:text-white"
                : "text-muted-foreground"
            )}
          >
            <route.Icon className="h-4 w-4" />

            {route.label}

            {route.label === "Orders" && <Badge>{orders?.length ?? 0}</Badge>}

            {route.label === "Custom Requests" && (
              <Badge>{customOrders?.length ?? 0}</Badge>
            )}
            {route.active ||
              (route.subRoutes &&
                route?.subRoutes?.filter((subRoute) => subRoute.active).length >
                  0 && (
                  <span
                    className={cn(
                      "absolute  bottom-0 left-[1.11rem] h-6 translate-y-3 border-l-[.095rem] border-l-zinc-400"
                    )}
                  />
                ))}
          </Link>

          {(route.active ||
            (route.subRoutes &&
              route.subRoutes.some((subRoute) => subRoute.active))) && (
            <div className="relative  flex flex-col space-y-3 py-2">
              {route.subRoutes?.map((subRoute, idx) => {
                const threshold = route?.subRoutes?.findIndex(
                  (sr) => sr.active
                );

                return (
                  <Link
                    key={subRoute.href}
                    href={subRoute.href}
                    className={cn(
                      "group  relative flex items-center gap-2 rounded-lg px-3  py-0 font-normal text-zinc-400 transition-all hover:text-zinc-700",
                      subRoute.active && "text-zinc-800 dark:text-white"
                    )}
                  >
                    {idx <= threshold! && (
                      <span
                        className={cn(
                          "absolute left-[1.11rem] h-12 border-l-[.095rem] border-l-zinc-400",
                          subRoute.active && "top-0 h-2"
                        )}
                      />
                    )}

                    {subRoute.active && (
                      <CornerDownRight className="ml-[.25rem] h-4 w-4 text-zinc-400" />
                    )}

                    <CornerDownRight className="absolute ml-[.25rem] hidden h-4 w-4 text-zinc-400 group-hover:flex" />
                    <span className={cn(!subRoute.active && "ml-[1.75rem]")}>
                      {" "}
                      {subRoute.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      ))}
    </nav>
  );
};
