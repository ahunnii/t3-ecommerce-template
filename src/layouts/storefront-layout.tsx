import { useEffect } from "react";

import Footer from "~/components/core/footer";
import Navbar from "~/components/core/navbar";

import useCart from "~/features/cart/hooks/use-cart";
import { cn } from "~/utils/styles";

const StorefrontLayout = ({
  children,
  bodyStyle = "",
}: {
  children: React.ReactNode;
  bodyStyle?: string;
}) => {
  const updateStore = () => void useCart.persist.rehydrate();

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
      {/* <main className="flex h-full  min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto h-full w-full max-w-7xl flex-grow">
          {children}
        </div>



        <Footer />
      </main> */}

      <main className="flex h-full  min-h-screen flex-col">
        <Navbar />

        <div
          className={cn(
            "mx-auto  h-full w-full max-w-7xl flex-grow",
            bodyStyle
          )}
        >
          {children}
        </div>
        {/* <div className="mx-auto h-full w-full max-w-7xl flex-grow">
         
        </div> */}

        <Footer />
      </main>
    </>
  );
};

export default StorefrontLayout;
