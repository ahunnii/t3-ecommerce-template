import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import getCategories from "~/actions/app/get-categories";
import getCollections from "~/actions/app/get-collections";
import MainNav from "~/components/app/main-nav";
import NavbarActions from "~/components/app/navbar-actions";
import Container from "~/components/app/ui/container";

const Navbar = () => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: collections } = useQuery({
    queryKey: ["collections"],
    queryFn: getCollections,
  });

  return (
    <div className="border-b">
      <Container>
        <div className="relative flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="ml-4 flex gap-x-2 lg:ml-0">
            <p className="text-xl font-bold">STORE</p>
          </Link>
          {categories && collections && (
            <MainNav data={categories} collections={collections} />
          )}
          <NavbarActions />
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
