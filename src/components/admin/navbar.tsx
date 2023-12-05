import { MainNav } from "~/components/admin/main-nav";
import StoreSwitcher from "~/components/admin/store-switcher";
import { ThemeToggle } from "~/components/admin/theme-toggle";

import { api } from "~/utils/api";
const Navbar = () => {
  const { data: stores } = api.store.getAllStores.useQuery();

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        {stores && <StoreSwitcher items={stores} />}
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          {/* <UserButton afterSignOutUrl="/" /> */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
