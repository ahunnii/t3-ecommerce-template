import { signIn, signOut, useSession } from "next-auth/react";

import Link from "next/link";

import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";

import { useRouter } from "next/navigation";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";

import { Instagram, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { api } from "~/utils/api";
import { cn } from "~/utils/styles";
import type { SiteLinks } from "./navbar";

export function MobileNav({ links }: { links: SiteLinks[] }) {
  const [open, setOpen] = useState(false);
  const { data: sessionData } = useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const getStore = api.store.getStore.useQuery({}, { enabled: false });

  useEffect(() => {
    setIsMounted(true);
    void getStore.refetch();
  }, []);

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

      <SheetContent
        side="left"
        className="flex h-svh w-5/6 flex-col border-zinc-950 bg-zinc-950 text-secondary"
      >
        {/* <Link href="/" className="flex items-center">
          <p className="sr-only text-xl font-bold">
            {env.NEXT_PUBLIC_STORE_NAME}
          </p>

          <>
            <Image
              src={`/${env.NEXT_PUBLIC_STORE_TYPE}/logo-alt.png`}
              width={80}
              height={80}
              alt="logo"
            />
          </>
        </Link> */}

        <ScrollArea className="my-4 h-3/4 pb-10 ">
          <div className="flex flex-col space-y-8 pt-6 ">
            {links?.map((item, idx) => {
              if (item?.href) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center text-xl font-light  text-white transition-colors hover:text-purple-500"
                      // pathname === item.href ||
                      //   item.href?.startsWith(`${pathname}/`)
                      //   ? "text-purple-500"
                      //   : "text-neutral-500"
                    )}
                  >
                    {item.title}
                  </Link>
                );
              }

              if (item?.links) {
                return (
                  <div className="flex flex-col space-y-2" key={idx}>
                    <div className="flex flex-col space-y-3 ">
                      <h4 className="text-xl font-semibold text-purple-800 ">
                        {item.title}
                      </h4>
                      {item.links.map((link, index) => (
                        <Link
                          key={link.href + index}
                          href={link.href}
                          className={cn(
                            "text-xl font-light text-white transition-colors hover:text-purple-500"
                            // pathname === link.href
                            //   ? "text-purple-500"
                            //   : "text-neutral-500"
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

        <footer className="mt-auto flex items-center justify-between gap-4 border-t border-t-white pt-4">
          {!sessionData && (
            <Button
              className="w-full bg-purple-700 hover:bg-purple-500"
              onClick={() => void signIn()}
            >
              Sign in{" "}
            </Button>
          )}
          {sessionData && (
            <>
              {/* <Button
                variant="ghost"
                className="relative  w-fit gap-2 "
                onClick={() => router.push("/account")}
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={sessionData?.user?.image ?? ""}
                    alt={`@${sessionData?.user?.name}`}
                  />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>

                {sessionData?.user?.name}
              </Button> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative  w-fit gap-2">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={sessionData?.user?.image ?? ""}
                        alt={`@${sessionData?.user?.name}`}
                      />
                      <AvatarFallback>
                        <User />
                      </AvatarFallback>
                    </Avatar>

                    {sessionData?.user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 border border-purple-500 bg-zinc-950 text-white"
                  align="start"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium leading-none">
                          {sessionData?.user?.name}
                        </p>
                      </div>
                      <p className="text-xs leading-none text-muted-foreground">
                        {sessionData?.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push("/account")}
                    className="hover:bg-purple-500 hover:text-white focus:bg-purple-500 focus:text-white"
                  >
                    Profile
                  </DropdownMenuItem>
                  {sessionData?.user?.id === getStore?.data?.userId ||
                  sessionData?.user?.role === "ADMIN" ? (
                    <>
                      <DropdownMenuItem
                        asChild
                        className="hover:bg-purple-500 hover:text-white focus:bg-purple-500 focus:text-white"
                      >
                        <Link href="/admin" target="_blank">
                          Admin{" "}
                        </Link>
                      </DropdownMenuItem>
                    </>
                  ) : null}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => void signOut()}
                    className="hover:bg-purple-500 hover:text-white focus:bg-purple-500 focus:text-white"
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* <Button
                className="border:bg-purple-500 w-full border-purple-700 bg-transparent hover:bg-purple-500 hover:text-white"
                onClick={() => void signOut()}
                variant={"outline"}
              >
                Sign out{" "}
              </Button> */}
            </>
          )}
          <Link
            href="https://www.instagram.com/trendanomaly/?hl=en"
            target="_blank"
          >
            <Button
              variant="ghost"
              className="group  aspect-square rounded-full p-0"
            >
              {" "}
              <Instagram className="h-6 w-6 text-white transition-all duration-150 ease-linear group-hover:text-black" />
            </Button>
          </Link>{" "}
        </footer>
      </SheetContent>
    </Sheet>
  );
}
