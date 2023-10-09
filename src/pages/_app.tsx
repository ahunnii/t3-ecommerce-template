import { AnimatePresence, motion } from "framer-motion";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import Router, { useRouter } from "next/router";
import "~/styles/globals.css";
import { api } from "~/utils/api";

import Head from "next/head";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { Toaster } from "~/components/ui/toaster";
import { ModalProvider } from "~/providers/admin/modal-provider";
import StorefrontModalProvider from "~/providers/app/modal-provider";
import { ThemeProvider } from "~/providers/theme-provider";
import { ToastProvider } from "~/providers/toast-provider";

Router.events.on("routeChangeStart", (url) => {
  NProgress.start();
});

Router.events.on("routeChangeComplete", (url) => {
  NProgress.done(false);
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();

  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ToastProvider />
        <ModalProvider />
        <StorefrontModalProvider />
        <AnimatePresence mode="wait">
          <motion.div
            key={router.route}
            initial="initialState"
            animate="animateState"
            exit="exitState"
            transition={{
              duration: 0.75,
            }}
            variants={{
              initialState: {
                opacity: 0,
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
              },
              animateState: {
                opacity: 1,
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
              },
              exitState: {
                clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
              },
            }}
            className="base-page-size"
          >
            <Component {...pageProps} /> <Toaster />
          </motion.div>{" "}
        </AnimatePresence>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
