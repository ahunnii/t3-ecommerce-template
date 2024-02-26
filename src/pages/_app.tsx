import "@uploadthing/react/styles.css";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { Toaster } from "~/components/ui/toaster";
import { ModalProvider } from "~/providers/admin/modal-provider";
import StorefrontModalProvider from "~/providers/core/modal-provider";
import { ConfigProvider } from "~/providers/style-config-provider";
import { ThemeProvider } from "~/providers/theme-provider";
import { ToastProvider } from "~/services/toast/toaster-provider";
// import { ToastProvider } from "~/providers/toast-provider";
import { AxiomWebVitals } from "next-axiom";
import { storeTheme as storeThemeCore } from "~/data/config.core";
import { storeTheme } from "~/data/config.custom";
import { env } from "~/env.mjs";
import "~/styles/globals.css";
import { api } from "~/utils/api";

Router.events.on("routeChangeStart", () => {
  NProgress.start();
});

Router.events.on("routeChangeComplete", () => {
  NProgress.done(false);
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      {/* <AxiomWebVitals /> */}
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        forcedTheme="light"
      >
        <ToastProvider />
        <ModalProvider />
        <StorefrontModalProvider />

        <ConfigProvider config={storeTheme}>
          <>
            <Component {...pageProps} /> <Toaster />
          </>
        </ConfigProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
