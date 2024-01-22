import Image from "next/image";
import Link from "next/link";

import Container from "~/components/core/ui/container";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";
import { cn } from "~/utils/styles";

import MainNav from "./main-nav";
import NavbarActions from "./navbar-actions";

const Navbar = ({
  navStyles = "",
  linkStyles = "",
}: {
  navStyles?: string;
  linkStyles?: string;
}) => {
  const { data: categories } = api.collections.getAllCollections.useQuery({
    isFeatured: true,
  });

  const { data: collections } = api.collections.getAllCollections.useQuery({
    storeId: env.NEXT_PUBLIC_STORE_ID,
  });

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-50 w-full border-b bg-white",
        navStyles
      )}
    >
      {/* <Container>
        <div className="relative flex h-16 items-center justify-center overflow-hidden  bg-orange-500 px-4 sm:px-6 lg:px-8 ">
          <Link href="/" className="ml-4 flex gap-x-2 lg:ml-0">
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
          {categories && collections && (
            <MainNav data={categories} collections={collections} />
          )}
          <NavbarActions />
        </div>
      </Container> */}

      <Container>
        <div className="h-18 relative flex w-full items-center justify-between   px-4 sm:px-6 lg:px-8 ">
          <div className="flex items-center justify-start max-md:w-2/3  md:flex-row-reverse">
            <div className=" max-md:w-1/2">
              {categories && collections && (
                <MainNav data={categories} collections={collections} />
              )}{" "}
            </div>

            <div className="ml-4  flex justify-start gap-x-2 overflow-hidden max-md:w-1/2 max-md:justify-center lg:ml-0">
              <Link href="/" className="mx-auto flex">
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
            </div>
          </div>

          <div className="flex max-md:w-1/3 max-md:justify-end">
            <NavbarActions />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
