import type { Store } from "@prisma/client";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import StoreSwitcher from "~/modules/admin/components/store-switcher";
import { ThemeToggle } from "~/modules/admin/components/theme-toggle";
import { MainNav } from "~/modules/navigation/admin/main-nav";

import { Button } from "../../../components/ui/button";
import { AdminSearch } from "./admin-search";
const Navbar = ({ stores }: { stores: Store[] }) => {
  return (
    <div className="w-full border-b shadow-sm ">
      <div className="flex h-16 items-center px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="hidden max-lg:flex">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"}>
            <div className="flex h-full max-h-screen w-full flex-col gap-2">
              <div className="flex h-[60px] items-center border-b px-6">
                {stores?.length > 0 && <StoreSwitcher items={stores} />}
              </div>
              <div className="flex-1 overflow-auto py-2">
                <MainNav className="grid items-start px-4 text-sm font-medium lg:space-x-0" />
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <AdminSearch />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
