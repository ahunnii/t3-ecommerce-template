/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  Calculator,
  Calendar,
  CreditCard,
  Search,
  Settings,
  Smile,
  User,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Button } from "~/components/ui/button";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "~/components/ui/command";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";

export function AdminSearch() {
  const [open, setOpen] = React.useState(false);
  const getAllProducts = api.products.getAllProducts.useQuery(
    {},
    { enabled: false }
  );

  const getAllOrders = api.orders.getAllOrders.useQuery({}, { enabled: false });

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
        void getAllProducts.refetch();
        void getAllOrders.refetch();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const openSearchModal = () => {
    void getAllProducts.refetch();
    void getAllOrders.refetch();
    setOpen(true);
  };

  return (
    <>
      <Button
        onClick={openSearchModal}
        className="flex w-96 items-center justify-between gap-2 "
        variant="ghost"
      >
        <span className="flex items-center gap-2">
          <Search className="text-grey-50 size-5 " /> Search anything...
        </span>
        <p className="text-sm text-muted-foreground">
          Press{" "}
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>J
          </kbd>
        </p>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <Link
              prefetch={false}
              href={`/admin/${env.NEXT_PUBLIC_STORE_ID}/orders`}
            >
              <CommandItem>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Orders</span>
              </CommandItem>{" "}
            </Link>
            <Link
              prefetch={false}
              href={`/admin/${env.NEXT_PUBLIC_STORE_ID}/products`}
            >
              <CommandItem>
                <Smile className="mr-2 h-4 w-4" />
                <span>Products</span>
              </CommandItem>
            </Link>
            <Link
              prefetch={false}
              href={`/admin/${env.NEXT_PUBLIC_STORE_ID}/settings`}
            >
              <CommandItem>
                <Calculator className="mr-2 h-4 w-4" />
                <span>Calculator</span>
              </CommandItem>
            </Link>
          </CommandGroup>
          <CommandSeparator />
          {/* <CommandGroup heading="Settings">
            <CommandItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup> */}

          <CommandGroup heading="Products">
            {getAllProducts.data?.map((product) => (
              <Link
                prefetch={false}
                href={`/admin/${env.NEXT_PUBLIC_STORE_ID}/products/${product.id}`}
                key={product.id}
              >
                <CommandItem>
                  <span>{product.name}</span>
                </CommandItem>
              </Link>
            ))}
          </CommandGroup>

          <CommandGroup heading="Orders">
            {getAllOrders.data?.map((order) => (
              <Link
                prefetch={false}
                href={`/admin/${env.NEXT_PUBLIC_STORE_ID}/orders/${order.id}`}
                key={order.id}
              >
                <CommandItem className="flex flex-col items-start justify-start">
                  <span>{`Order #${order.id}`}</span>
                  <span>{order.createdAt.toDateString()}</span>
                </CommandItem>
              </Link>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
