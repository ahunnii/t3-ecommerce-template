import Image from "next/image";
import Link from "next/link";

import Container from "~/components/core/ui/container";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";
import { cn } from "~/utils/styles";

import { STORE_NAME } from "../../../data/config.custom";
import MainNav from "./main-nav";
import NavbarActions from "./navbar-actions";

import { useTheme } from "next-themes";
import { useEffect, useMemo } from "react";
import { storeTheme } from "~/data/config.custom";
import { MobileNav } from "./mobile-nav";

export type SiteLinks = {
  title: string;
  href?: string | undefined;
  description?: string;
  pathname?: string;
  links?:
    | [
        {
          title: string;
          href: string;
          description?: string;
        }
      ]
    | undefined;
};
const Navbar = ({
  navStyles = "",
}: {
  navStyles?: string;
  linkStyles?: string;
}) => {
  const getAllCollections = api.collections.getAllCollections.useQuery(
    {},
    { enabled: false }
  );

  useEffect(() => void getAllCollections.refetch(), []);

  const navigationLinks = useMemo(() => {
    return [
      {
        title: "Home",
        href: "/",
      },
      {
        title: "Shop",
        href: "/collections/all-products",
      },
      {
        title: "The Shop",

        links: [
          {
            title: "About Us",
            href: "/about-us",
            description:
              "Learn more about who we are and what our brand provides.",
          },
          {
            title: "Gallery",
            href: "/gallery",
            description:
              "Check out our gallery to see some of our previous work.",
          },
          {
            title: "Blog",
            href: "/blog",
            description: "Read our blog to stay up to date with our brand.",
          },
          {
            title: "Shipping Policy",
            href: "/policies/shipping-policy",
            description:
              "Find out what our shipping policy is and how we handle shipping.",
          },
          {
            title: "Privacy Policy",
            href: "/policies/privacy-policy",
            description:
              "Learn more about our privacy policy and how we handle data.",
          },
        ],
      },

      getAllCollections?.data
        ? {
            title: "Collections",
            pathname: "/collections",
            links: [
              ...getAllCollections?.data?.map((collection) => ({
                title: collection?.name,
                href: `/collections/${collection?.id}`,
                description: "",
              })),
              {
                title: "View All",
                href: "/collections",
                description: "",
              },
            ],
          }
        : {
            title: "Collections",
            pathname: "/collections",
            links: [
              {
                title: "View All",
                href: "/collections",
                description: "",
              },
            ],
          },

      {
        title: "Custom",
        href: "/custom-request",
      },

      {
        title: "Contact Us",
        href: "/contact-us",
      },
    ] as SiteLinks[];
  }, [getAllCollections?.data]);

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-50 w-full border-b bg-white",
        navStyles
      )}
    >
      <Container>
        <div className="h-18 relative flex w-full items-center justify-between px-4 sm:px-6 lg:px-8 ">
          <div className="flex items-center max-md:w-2/3 md:flex-row-reverse  md:justify-center lg:justify-start">
            <div className="mx-auto max-md:w-1/2">
              {navigationLinks && (
                <>
                  <MobileNav links={navigationLinks} />
                  <MainNav links={navigationLinks} />
                </>
              )}
            </div>

            <NavBarLogo />
          </div>

          <NavbarActions />
        </div>
      </Container>
    </div>
  );
};

const NavBarLogo = () => {
  return (
    <div className="ml-4  flex justify-start gap-x-2 overflow-hidden max-md:w-1/2 max-md:justify-center lg:ml-0  ">
      <Link href="/" className="mx-auto flex  flex-shrink-0">
        <p className="sr-only text-xl font-bold">{STORE_NAME}</p>

        <Image
          src={storeTheme.logo.default}
          width={80}
          height={80}
          className=" h-20 w-20"
          alt="logo"
        />
      </Link>
    </div>
  );
};
export default Navbar;
