import { useEffect } from "react";

import { Footer as DefaultFooter } from "~/components/core/footer";
import { Navbar as DefaultNavbar } from "~/components/core/navbar";
import { SEO } from "~/components/core/seo-head";

import useCart from "~/modules/cart/hooks/use-cart";
import { useConfig } from "~/providers/style-config-provider";
import { cn } from "~/utils/styles";

export const DefaultStoreFrontLayout = ({
  children,
  metadata,
  PageContent,
  NavBar,
  Footer,
}: {
  children: React.ReactNode;
  metadata?: {
    title: string;
    description: string;
  };
  NavBar?: React.FC<{ navStyles?: string; linkStyles?: string }>;
  PageContent?: React.FC;
  Footer?: React.FC;
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
      <main
        className={cn(
          "flex h-full  min-h-screen flex-col",
          config.theme.layout.mainStyle
        )}
      >
        {NavBar ? (
          <NavBar navStyles={config.theme.layout.navStyles} />
        ) : (
          <DefaultNavbar navStyles={config.theme.layout.navStyles} />
        )}

        <div
          className={cn(
            "mx-auto  h-full w-full max-w-7xl flex-grow px-4 pb-10 pt-16 sm:px-6 lg:px-8"
          )}
        >
          {PageContent ? <PageContent /> : <>{children}</>}
        </div>

        {Footer ? <Footer /> : <DefaultFooter />}
      </main>
    </>
  );
};
