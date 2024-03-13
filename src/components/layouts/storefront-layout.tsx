import { useTheme } from "next-themes";
import { useEffect } from "react";

import { Footer as DefaultFooter } from "~/components/core/footer";
import { Navbar as DefaultNavbar } from "~/components/core/navbar";
import { SEO } from "~/components/core/seo-head";

import useCart from "~/modules/cart/hooks/use-cart";
import { useConfig } from "~/providers/style-config-provider";
import { cn } from "~/utils/styles";

const StorefrontLayout = ({
  children,
  metadata,
  isLoading = false,
  NavBar = DefaultNavbar,
  Footer = DefaultFooter,
  bodyStyle = "",
  mainStyle = "",
  navStyles = "",
}: {
  isLoading?: boolean;
  children: React.ReactNode;
  metadata?: {
    title: string;
    description: string;
  };
  NavBar?: React.FC<{ navStyles?: string; linkStyles?: string }>;
  Footer?: React.FC;
  bodyStyle?: string;
  mainStyle?: string;
  navStyles?: string;
}) => {
  const updateStore = () => void useCart.persist.rehydrate();
  const config = useConfig();

  useEffect(() => {
    document.addEventListener("visibilitychange", updateStore);
    window.addEventListener("focus", updateStore);
    return () => {
      document.removeEventListener("visibilitychange", updateStore);
      window.removeEventListener("focus", updateStore);
    };
  }, []);

  return (
    <>
      <SEO
        title={metadata?.title ?? `Template Site`}
        description={metadata?.description ?? "Lorem Ipsum"}
      />
      <main className={cn("flex h-full  min-h-screen flex-col", mainStyle)}>
        <NavBar navStyles={cn(config.navigation.body, navStyles)} />

        <div
          className={cn(
            "mx-auto  h-full w-full max-w-7xl flex-grow px-4 pb-20 pt-28 sm:px-6 lg:px-8",
            bodyStyle
          )}
        >
          {children}
        </div>

        <Footer />
      </main>
    </>
  );
};

export default StorefrontLayout;
