import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  useState,
} from "react";

import { Button } from "~/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";

import { env } from "~/env.mjs";

import { cn } from "~/utils/styles";

import type { Collection, DetailedCollection } from "~/types";

interface MainNavProps {
  data: DetailedCollection[];
  collections: Partial<Collection>[];
}

const MainNav: React.FC<MainNavProps> = ({ collections }) => {
  const pathname = usePathname();

  const storeLinks: { title: string; href: string; description: string }[] = [
    {
      title: "About Us",
      href: "/about-us",
      description: "Learn more about who we are and what our brand provides. ",
    },
    {
      title: "Gallery",
      href: "/gallery",
      description: "Check out our gallery to see some of our previous work.",
    },
    {
      title: "Shipping Policy",
      href: "/policies/shipping-policy",
      description:
        "Find out what our shipping policy is and how we handle shipping.",
    },
    {
      title: "Privacy Policy",
      href: "/policies/privacy-policy",
      description:
        "Learn more about our privacy policy and how we handle data.",
    },
  ];

  return (
    <>
      <MobileNav collections={collections} />
      <nav className="mx-6 flex items-center space-x-4 max-md:hidden lg:space-x-6">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href={"/collections/all-products"}>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-sm font-medium transition-colors hover:text-purple-500",
                    "bg-transparent hover:bg-transparent focus:bg-transparent focus:text-purple-400 data-[active]:bg-transparent data-[state=open]:bg-transparent",
                    pathname === `/collections/all-products`
                      ? "text-purple-500"
                      : "text-neutral-500"
                  )}
                >
                  Shop
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={cn(
                  " text-sm font-medium transition-colors  hover:text-purple-500 ",
                  "bg-transparent hover:bg-transparent focus:bg-transparent focus:text-purple-400 data-[active]:bg-transparent data-[state=open]:bg-transparent",
                  "cursor-pointer text-neutral-500"
                )}
              >
                The Shop
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {storeLinks.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={cn(
                  " text-sm font-medium transition-colors  hover:text-purple-500 ",
                  "bg-transparent hover:bg-transparent focus:bg-transparent focus:text-purple-400 data-[active]:bg-transparent data-[state=open]:bg-transparent",
                  "cursor-pointer text-neutral-500"
                )}
              >
                Collections
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {collections.map((collection) => (
                    <ListItem
                      key={collection.id}
                      title={collection.name}
                      href={`/collections/${collection.id}`}
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-purple-500",
                        pathname === `/collections/${collection.id}`
                          ? "text-purple-500"
                          : "text-neutral-500"
                      )}
                    >
                      {/* {component.description} */}
                    </ListItem>
                  ))}{" "}
                  <ListItem
                    key={"all-collections"}
                    title={"View All"}
                    href={`/collections`}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-purple-500",
                      pathname === `/collections`
                        ? "text-purple-500"
                        : "text-neutral-500"
                    )}
                  ></ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href={"/contact-us"}>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-sm font-medium transition-colors hover:text-purple-500",
                    "bg-transparent hover:bg-transparent focus:bg-transparent focus:text-purple-400 data-[active]:bg-transparent data-[state=open]:bg-transparent",
                    pathname === `/contact-us`
                      ? "text-purple-500"
                      : "text-neutral-500"
                  )}
                >
                  Contact Us
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        {/* 
        <HoverCard openDelay={0}>
          <HoverCardTrigger>
            <p
              className={cn(
                "text-sm font-medium transition-colors hover:text-purple-500",
                "cursor-pointer text-neutral-500"
              )}
            >
              The Store
            </p>
          </HoverCardTrigger>
          <HoverCardContent className="w-auto">
            <div className="space-y-1">
              <div className="flex  flex-col  gap-5 ">
                <Link
                  href={`/about-us`}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-purple-500",
                    pathname === `/about-us`
                      ? "text-purple-500"
                      : "text-neutral-500"
                  )}
                >
                  About Us
                </Link>
                <Link
                  href={`/gallery`}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-purple-500",
                    pathname === `/gallery`
                      ? "text-purple-500"
                      : "text-neutral-500"
                  )}
                >
                  Gallery
                </Link>
                <Link
                  href={`/policies/shipping-policy`}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-purple-500",
                    pathname === `/policies/shipping-policy`
                      ? "text-purple-500"
                      : "text-neutral-500"
                  )}
                >
                  Shipping Policy
                </Link>
                <Link
                  href={`/policies/privacy-policy`}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-purple-500",
                    pathname === `/policies/privacy-policy`
                      ? "text-purple-500"
                      : "text-neutral-500"
                  )}
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
        {collections?.length > 0 && (
          <HoverCard openDelay={0}>
            <HoverCardTrigger>
              <Link
                href={"/collections"}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-purple-500",
                  pathname === "/collections"
                    ? "text-purple-500"
                    : "text-neutral-500"
                )}
              >
                Collections
              </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto">
              <div className="space-y-1">
                <div className="flex  flex-col items-center gap-5 ">
                  {collections?.length &&
                    collections.map((collection) => (
                      <Link
                        href={`/collections/${collection.id}`}
                        key={collection.id}
                        className={cn(
                          "text-sm font-medium transition-colors hover:text-purple-500",
                          pathname === `/collections/${collection.id}`
                            ? "text-purple-500"
                            : "text-neutral-500"
                        )}
                      >
                        {collection.name}
                      </Link>
                    ))}
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        )}

        <Link
          href={"/contact-us"}
          className={cn(
            "text-sm font-medium transition-colors hover:text-purple-500",
            pathname === `/contact-us` ? "text-purple-500" : "text-neutral-500"
          )}
        >
          Contact Us
        </Link> */}
      </nav>
    </>
  );
};

export default MainNav;

export const mobileConfig = {
  mainNav: [
    {
      title: "Shop All",
      href: "/collections/all-products",
    },
    {
      title: "Contact Us",
      href: "/contact-us",
    },
  ],
};

export function MobileNav({
  collections,
}: {
  collections: Partial<Collection>[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 aspect-square rounded-full bg-purple-500 px-0 text-base text-white hover:bg-purple-500 focus-visible:bg-purple-500 focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <svg
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
          >
            <path
              d="M3 5H11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M3 12H16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M3 19H21"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="pr-0">
        <Link href="/" className="flex items-center">
          <p className="sr-only text-xl font-bold">
            {env.NEXT_PUBLIC_STORE_NAME}
          </p>

          <>
            <Image
              src={`/${env.NEXT_PUBLIC_STORE_TYPE}/logo.png`}
              width={80}
              height={80}
              alt="logo"
            />
          </>
        </Link>

        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            {mobileConfig.mainNav?.map(
              (item) =>
                item.href && (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center text-xl transition-colors hover:text-purple-500",
                      pathname === `/collections/all-products`
                        ? "text-purple-500"
                        : "text-neutral-500"
                    )}
                  >
                    {item.title}
                  </Link>
                )
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex flex-col space-y-3 pt-6">
              <h4 className="text-xl font-medium ">The Shop</h4>
              <Link
                href={`/about-us`}
                className={cn(
                  "text-xl font-medium transition-colors hover:text-purple-500",
                  pathname === `/about-us`
                    ? "text-purple-500"
                    : "text-neutral-500"
                )}
              >
                About Us
              </Link>
              <Link
                href={`/gallery`}
                className={cn(
                  "text-xl font-medium transition-colors hover:text-purple-500",
                  pathname === `/gallery`
                    ? "text-purple-500"
                    : "text-neutral-500"
                )}
              >
                Gallery
              </Link>
              <Link
                href={`/policies/shipping-policy`}
                className={cn(
                  "text-xl font-medium transition-colors hover:text-purple-500",
                  pathname === `/policies/shipping-policy`
                    ? "text-purple-500"
                    : "text-neutral-500"
                )}
              >
                Shipping Policy
              </Link>
              <Link
                href={`/policies/privacy-policy`}
                className={cn(
                  "text-xl font-medium transition-colors hover:text-purple-500",
                  pathname === `/policies/privacy-policy`
                    ? "text-purple-500"
                    : "text-neutral-500"
                )}
              >
                Privacy Policy
              </Link>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex flex-col space-y-3 pt-6">
              <h4 className="text-xl font-medium ">Collections</h4>
              {collections?.length &&
                collections.map((collection) => (
                  <Link
                    href={`/collections/${collection.id}`}
                    key={collection.id}
                    className={cn(
                      "text-xl font-medium transition-colors hover:text-purple-500",
                      pathname === `/collections/${collection.id}`
                        ? "text-purple-500"
                        : "text-neutral-500"
                    )}
                  >
                    {collection.name}
                  </Link>
                ))}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
const ListItem = forwardRef<ElementRef<"a">, ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";
