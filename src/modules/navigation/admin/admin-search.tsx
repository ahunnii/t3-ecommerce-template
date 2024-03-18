/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { CommandLoading } from "cmdk";
import _debounce from "lodash/debounce";
import {
  Calculator,
  Calendar,
  Check,
  CreditCard,
  Loader2,
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
import { CommandAdvancedDialog } from "~/components/ui/command-advanced";
import { env } from "~/env.mjs";
import SearchSelectOptions from "~/modules/admin/components/search-select-options";
import { api } from "~/utils/api";
import { cn } from "~/utils/styles";

export function AdminSearch() {
  const ref = React.useRef<HTMLInputElement>(null);
  const apiContext = api.useContext();

  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);
  const [selectedCustoms, setSelectedCustoms] = React.useState<string[]>([]);

  const [open, setOpen] = React.useState(false);

  const [value, setValue] = React.useState("");

  const getAllProducts = api.products.searchForProducts.useQuery(
    { queryString: value },
    { enabled: false }
  );

  const getAllCustomOrders = api.customOrder.searchForCustomOrders.useQuery(
    { queryString: value },
    { enabled: false }
  );

  const debounceFn = React.useCallback(_debounce(handleDebounceFn, 1000), []);

  function handleDebounceFn() {
    void getAllProducts.refetch();
    void getAllCustomOrders.refetch();
  }

  function handleChange(data: string) {
    setValue(data);

    debounceFn();
  }

  const getAllOrders = api.orders.getAllOrders.useQuery({}, { enabled: false });

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
        // void getAllProducts.refetch();
        // void getAllOrders.refetch();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const openSearchModal = () => {
    // void getAllProducts.refetch();

    // void getAllOrders.refetch();
    setOpen(true);
  };

  const listRef = React.useRef(null);

  const handleOnCommandDialogOpen = (state: boolean) => {
    if (!state) {
      void apiContext.products.invalidate();
      setValue("");
      setSelectedProducts([]);
    }
    setOpen(state);
  };

  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 500);
    }
  }, [open]);
  return (
    <>
      <Button
        onClick={openSearchModal}
        className="flex w-full items-center justify-between gap-2 xl:mx-auto xl:max-w-2xl "
        variant="outline"
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

      <CommandAdvancedDialog
        open={open}
        onOpenChange={handleOnCommandDialogOpen}
        shouldFilter={!getAllProducts.isLoading}
      >
        <CommandInput
          placeholder="Type a command or search..."
          ref={ref}
          value={value}
          onValueChange={handleChange}
        />
        <CommandList ref={listRef}>
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
          {!getAllProducts.isLoading && getAllProducts.data?.length !== 0 && (
            <CommandGroup heading="Products">
              {getAllProducts.data?.map((product) => (
                // <Link
                //   prefetch={false}
                //   href={`/admin/${env.NEXT_PUBLIC_STORE_ID}/products/${product.id}`}
                //   key={product.id}
                // >
                <CommandItem
                  key={product.id}
                  onSelect={() => {
                    setSelectedProducts(
                      selectedProducts.includes(product.id)
                        ? selectedProducts.filter((item) => item !== product.id)
                        : [...selectedProducts, product.id]
                    );
                  }}
                >
                  <span>{product.name}</span>

                  <span className="sr-only">{product.category.name}</span>
                  {product.collections.map((collection) => (
                    <span key={collection.id} className="sr-only">
                      {collection.name}
                    </span>
                  ))}
                  {product.tags.map((tag) => (
                    <span key={tag.id} className="sr-only">
                      {tag.name}
                    </span>
                  ))}

                  {product.materials.map((materials) => (
                    <span key={materials.id} className="sr-only">
                      {materials.name}
                    </span>
                  ))}

                  <span className="sr-only">{product.description}</span>

                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedProducts.includes(product.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
                // </Link>
              ))}

              {getAllProducts.data?.length === 0 && (
                <CommandItem>No products found</CommandItem>
              )}
            </CommandGroup>
          )}

          {getAllProducts.isLoading && value !== "" && (
            <CommandLoading>
              <CommandItem>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Fetching
                products
              </CommandItem>
            </CommandLoading>
          )}

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
        <CommandSeparator />
        <CommandList className="mb-12">
          <>
            {!getAllCustomOrders.isLoading &&
              getAllCustomOrders.data?.length !== 0 && (
                <CommandGroup heading="Custom Orders">
                  {getAllCustomOrders.data?.map((customOrder) => (
                    // <Link
                    //   prefetch={false}
                    //   href={`/admin/${env.NEXT_PUBLIC_STORE_ID}/products/${product.id}`}
                    //   key={product.id}
                    // >
                    <CommandItem
                      key={customOrder.id}
                      onSelect={() => {
                        setSelectedCustoms(
                          selectedCustoms.includes(customOrder.id)
                            ? selectedCustoms.filter(
                                (item) => item !== customOrder.id
                              )
                            : [...selectedCustoms, customOrder.id]
                        );
                      }}
                    >
                      <span>{customOrder.name}</span>

                      <span className="sr-only">
                        {customOrder?.product?.name}
                      </span>

                      <span className="sr-only">{customOrder.email}</span>
                      <span className="sr-only">{customOrder.notes}</span>
                      <span className="sr-only">{customOrder.description}</span>

                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCustoms.includes(customOrder.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                    // </Link>
                  ))}

                  {getAllCustomOrders.data?.length === 0 && (
                    <CommandItem>No custom orders found</CommandItem>
                  )}
                </CommandGroup>
              )}

            {getAllCustomOrders.isLoading && value !== "" && (
              <CommandLoading>
                <CommandItem>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Fetching
                  custom orders
                </CommandItem>
              </CommandLoading>
            )}
          </>
        </CommandList>
        <div className="absolute bottom-0  flex h-12 w-full items-center justify-between border-t border-t-zinc-200 px-2 py-4">
          <p>Select items to see options</p>

          <hr />

          <SearchSelectOptions
            items={selectedProducts}
            listRef={listRef}
            inputRef={ref}
          />
        </div>
      </CommandAdvancedDialog>
    </>
  );
}
