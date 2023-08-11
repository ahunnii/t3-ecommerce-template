import Link from "next/link";

import getCategories from "~/actions/app/get-categories";
import MainNav from "~/components/app/main-nav";
import NavbarActions from "~/components/app/navbar-actions";
import Container from "~/components/app/ui/container";
import { api } from "~/utils/api";

const Navbar = () => {
  const { data: categories } = api.categories.getAllCategories.useQuery({
    storeId: process.env.NEXT_PUBLIC_STORE_ID!,
  });

  return (
    <div className="border-b">
      <Container>
        <div className="relative flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="ml-4 flex gap-x-2 lg:ml-0">
            <p className="text-xl font-bold">STORE</p>
          </Link>
          {categories && <MainNav data={categories} />}
          <NavbarActions />
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
