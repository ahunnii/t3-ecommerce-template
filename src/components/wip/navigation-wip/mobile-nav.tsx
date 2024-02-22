import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "~/components/ui/button";

import { ScrollArea } from "~/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";

import { env } from "~/env.mjs";

import { cn } from "~/utils/styles";

import type { SiteLinks } from "./navbar";

export function MobileNav({ links }: { links: SiteLinks[] }) {
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
          <div className="flex flex-col space-y-8 pt-6 ">
            {links?.map((item, idx) => {
              if (item.href) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center text-xl font-medium  transition-colors hover:text-purple-500",
                      pathname === item.href ||
                        item.href?.startsWith(`${pathname}/`)
                        ? "text-purple-500"
                        : "text-neutral-500"
                    )}
                  >
                    {item.title}
                  </Link>
                );
              }

              if (item.links) {
                return (
                  <div className="flex flex-col space-y-2" key={idx}>
                    <div className="flex flex-col space-y-3 ">
                      <h4 className="text-xl font-medium ">{item.title}</h4>
                      {item.links.map((link, index) => (
                        <Link
                          key={link.href + index}
                          href={link.href}
                          className={cn(
                            "text-xl font-medium transition-colors hover:text-purple-500",
                            pathname === link.href
                              ? "text-purple-500"
                              : "text-neutral-500"
                          )}
                        >
                          {link.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}