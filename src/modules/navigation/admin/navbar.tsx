import { Menu, Search } from "lucide-react";
import StoreSwitcher from "~/components/admin/store-switcher";
import { ThemeToggle } from "~/components/admin/theme-toggle";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { MainNav } from "~/modules/navigation/admin/main-nav";
import { api } from "~/utils/api";
import { Button } from "../../../components/ui/button";
import { AdminSearch } from "./admin-search";
const Navbar = () => {
  const { data: stores } = api.store.getAllStores.useQuery();

  return (
    <div className="w-full border-b shadow-sm">
      <div className="flex h-16 items-center px-4">
        {/* {stores && <StoreSwitcher items={stores} />} */}
        {/* <MainNav className="mx-6" /> */}{" "}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="hidden max-lg:flex">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"}>
            {/* <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </SheetDescription>
              </SheetHeader> */}

            <div className="flex h-full max-h-screen w-full flex-col gap-2">
              <div className="flex h-[60px] items-center border-b px-6">
                {stores && <StoreSwitcher items={stores} />}
              </div>
              <div className="flex-1 overflow-auto py-2">
                <MainNav className="grid items-start px-4 text-sm font-medium lg:space-x-0" />
              </div>
            </div>

            {/* <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit">Save changes</Button>
                </SheetClose>
              </SheetFooter> */}
          </SheetContent>
        </Sheet>
        <AdminSearch />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          {/* <UserButton afterSignOutUrl="/" /> */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
