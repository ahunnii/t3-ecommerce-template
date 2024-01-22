import { User } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import CartShoppingBag from "~/features/cart/components/cart-shopping-bag";

const NavbarActions = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { data: sessionData } = useSession();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const router = useRouter();

  if (!isMounted) {
    return null;
  }

  return (
    <div className="ml-auto flex items-center gap-x-4">
      {!sessionData && (
        <>
          <Button
            variant={"outline"}
            onClick={() => void signIn()}
            className="bg-black text-white"
          >
            Sign in
          </Button>
        </>
      )}
      {sessionData && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={sessionData?.user?.image ?? ""}
                  alt={`@${sessionData?.user?.name}`}
                />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
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
            <DropdownMenuItem onClick={() => router.push("/account")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => void signOut()}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <CartShoppingBag btnClassName="border-white/20 border" />
    </div>
  );
};

export default NavbarActions;