"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { cn } from "~/utils/styles";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  if (!params.storeId) return null;
  const routes = [
    {
      href: `/${params.storeId.toString()}`,
      label: "Overview",
      active: pathname === `/${params?.storeId.toString()}`,
    },
    {
      href: `/${params?.storeId.toString()}/billboards`,
      label: "Billboards",
      active: pathname === `/${params?.storeId.toString()}/billboards`,
    },
    {
      href: `/${params?.storeId.toString()}/categories`,
      label: "Categories",
      active: pathname === `/${params?.storeId.toString()}/categories`,
    },
    {
      href: `/${params?.storeId.toString()}/sizes`,
      label: "Sizes",
      active: pathname === `/${params?.storeId.toString()}/sizes`,
    },
    {
      href: `/${params?.storeId.toString()}/colors`,
      label: "Colors",
      active: pathname === `/${params?.storeId.toString()}/colors`,
    },
    {
      href: `/${params?.storeId.toString()}/products`,
      label: "Products",
      active: pathname === `/${params?.storeId.toString()}/products`,
    },
    {
      href: `/${params?.storeId.toString()}/orders`,
      label: "Orders",
      active: pathname === `/${params?.storeId.toString()}/orders`,
    },
    {
      href: `/${params?.storeId.toString()}/settings`,
      label: "Settings",
      active: pathname === `/${params?.storeId.toString()}/settings`,
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
}
