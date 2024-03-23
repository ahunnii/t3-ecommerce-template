import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, type FC, type HTMLAttributes } from "react";
import { api } from "~/utils/api";

import { uniqueId } from "lodash";
import {
  Boxes,
  CornerDownRight,
  Home,
  Image,
  Inbox,
  Server,
  Settings,
  Shirt,
  StickyNote,
  Tags,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "~/utils/styles";
import { Badge } from "../../../components/ui/badge";
import type { Route } from "./types";

interface MainNavProps extends HTMLAttributes<HTMLElement> {
  className?: string;
}
export function useActivePath(): (path: string) => boolean {
  const { query } = useRouter();
  const { storeId } = query as { storeId: string };
  const pathname = usePathname();

  const checkActivePath = (path: string) => {
    if (path === `/admin/${encodeURIComponent(storeId)}` && pathname !== path) {
      return false;
    }
    return pathname.startsWith(path);
  };

  return checkActivePath;
}

export const MainNavSublink: FC<MainNavProps> = ({ className, ...props }) => {
  const { query } = useRouter();
  const { storeId } = query as { storeId: string };
  const { data: orders } = api.orders.getOrderCount.useQuery({
    storeId,
  });
  const checkActivePath = useActivePath();
  const { data: customOrders } =
    api.customOrder.getPendingCustomRequests.useQuery({
      storeId,
    });

  const encodedStoreId = encodeURIComponent(storeId);

  if (!storeId) return null;

  const routes: Route[] = [
    {
      href: `/admin/${encodedStoreId}`,
      label: "Overview",
      active: checkActivePath(`/admin/${encodedStoreId}`),
      Icon: Home,
    },

    {
      href: `/admin/${encodedStoreId}/orders`,
      label: `Orders`,
      active: checkActivePath(`/admin/${encodedStoreId}/orders`),
      Icon: Inbox,
      subRoutes: [
        {
          href: `/admin/${encodedStoreId}/shipping`,
          label: `Shipping Labels`,
          active: checkActivePath(`/admin/${encodedStoreId}/shipping`),
        },
      ],
    },

    {
      href: `/admin/${encodedStoreId}/products`,
      label: "Products",
      active: checkActivePath(`/admin/${encodedStoreId}/products`),
      Icon: Shirt,
      subRoutes: [
        {
          href: `/admin/${encodedStoreId}/collections`,
          label: "Collections",
          active: checkActivePath(`/admin/${encodedStoreId}/collections`),
        },
        {
          href: `/admin/${encodedStoreId}/categories`,
          label: "Product Categories",
          active: checkActivePath(`/admin/${encodedStoreId}/categories`),
        },
      ],
    },

    {
      href: `/admin/${encodedStoreId}/discounts`,
      label: `Discounts`,
      active: checkActivePath(`/admin/${encodedStoreId}/discounts`),
      Icon: Tags,
    },

    {
      href: `/admin/${encodedStoreId}/custom-orders`,
      label: `Custom Requests`,
      active: checkActivePath(`/admin/${encodedStoreId}/custom-orders`),
      Icon: Boxes,
    },
    {
      href: `/admin/${encodedStoreId}/blog-posts`,
      label: "Blog Posts",
      active: checkActivePath(`/admin/${encodedStoreId}/blog-posts`),
      Icon: StickyNote,
    },
    {
      href: `/admin/${encodedStoreId}/gallery`,
      label: "Gallery",
      active: checkActivePath(`/admin/${encodedStoreId}/gallery`),
      Icon: Image,
    },
    {
      href: `/admin/${encodedStoreId}/services`,
      label: "Services",
      active: checkActivePath(`/admin/${encodedStoreId}/services`),
      Icon: Server,
      subRoutes: [
        {
          href: `/admin/${encodedStoreId}/services/media-uploads`,
          label: "Media Uploads",
          active: checkActivePath(
            `/admin/${encodedStoreId}/services/media-uploads`
          ),
        },
      ],
    },
    {
      href: `/admin/${encodedStoreId}/settings`,
      label: "Settings",
      active: checkActivePath(`/admin/${encodedStoreId}/settings`),
      Icon: Settings,
    },
  ];

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <Fragment key={uniqueId()}>
          <Link
            key={`${route.href}-${uniqueId()}`}
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

            {route.label === "Orders" && <Badge>{orders ?? 0}</Badge>}

            {route.label === "Custom Requests" && (
              <Badge>{customOrders ?? 0}</Badge>
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
            <div
              className={cn(
                "relative  flex flex-col space-y-3 ",
                route.subRoutes && "py-2"
              )}
            >
              {route.subRoutes?.map((subRoute, idx) => {
                const threshold = route?.subRoutes?.findIndex(
                  (sr) => sr.active
                );

                return (
                  <Link
                    key={`${subRoute.href}-${uniqueId()}`}
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
        </Fragment>
      ))}
    </nav>
  );
};
