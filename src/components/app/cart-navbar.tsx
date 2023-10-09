import { Lock } from "lucide-react";
import Link from "next/link";

import getCategories from "~/actions/app/get-categories";
import MainNav from "~/components/app/main-nav";
import NavbarActions from "~/components/app/navbar-actions";
import Container from "~/components/app/ui/container";

const CartNavbar = () => {
  return (
    <div className="border-b">
      <Container>
        <div className="relative flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="ml-4 flex gap-x-2 lg:ml-0">
            <p className="text-xl font-bold">STORE</p>
          </Link>
          {/* {categories && <MainNav data={categories} />} */}
          {/* <NavbarActions /> */}
          <p className="flex items-center gap-x-1 font-medium">
            <Lock className="h-4 w-4" /> Secure Checkout
          </p>
        </div>
      </Container>
    </div>
  );
};

export default CartNavbar;
