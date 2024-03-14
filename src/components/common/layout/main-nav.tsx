import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import type { Collection, DetailedCollection } from "~/types";
import { cn } from "~/utils/styles";
interface MainNavProps {
  data: DetailedCollection[];
  collections: Partial<Collection>[];
}

const MainNav: React.FC<MainNavProps> = ({ data, collections }) => {
  const pathname = usePathname();

  console.log(data);
  // const routes = data.map((route) => ({
  //   href: `/collections/${route.id}`,
  //   label: route.name,
  //   active: pathname === `/collections/${route.id}`,
  // }));

  return (
    <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
      <Link
        href={"/collections/all-products"}
        className={cn(
          "text-sm font-medium transition-colors hover:text-black",
          pathname === `/collections/all-products`
            ? "text-black"
            : "text-neutral-500"
        )}
      >
        Shop
      </Link>

      {/* {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-black",
            route.active ? "text-black" : "text-neutral-500"
          )}
        >
          {route.label}
        </Link>
      ))} */}

      <HoverCard openDelay={0}>
        <HoverCardTrigger>
          <p
            className={cn(
              "text-sm font-medium transition-colors hover:text-black",
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
                  "text-sm font-medium transition-colors hover:text-black",
                  pathname === `/about-us` ? "text-black" : "text-neutral-500"
                )}
              >
                About Us
              </Link>
              <Link
                href={`/gallery`}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-black",
                  pathname === `/gallery` ? "text-black" : "text-neutral-500"
                )}
              >
                Gallery
              </Link>
              <Link
                href={`/policies/shipping-policy`}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-black",
                  pathname === `/policies/shipping-policy`
                    ? "text-black"
                    : "text-neutral-500"
                )}
              >
                Shipping Policy
              </Link>
              <Link
                href={`/policies/privacy-policy`}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-black",
                  pathname === `/policies/privacy-policy`
                    ? "text-black"
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
                "text-sm font-medium transition-colors hover:text-black",
                pathname === "/collections/all-products"
                  ? "text-black"
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
                        "text-sm font-medium transition-colors hover:text-black",
                        pathname === `/collections/${collection.id}`
                          ? "text-black"
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
          "text-sm font-medium transition-colors hover:text-black",
          pathname === `/contact-us` ? "text-black" : "text-neutral-500"
        )}
      >
        Contact Us
      </Link>
    </nav>
  );
};

export default MainNav;
