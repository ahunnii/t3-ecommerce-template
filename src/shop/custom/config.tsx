import type { FC } from "react";
import Footer from "./components/footer";
import Navbar from "./modules/navigation/navbar";

export const STORE_NAME = "trend-anomaly";

export const storeTheme = {
  layout: {
    mainStyle: "bg-fuchsia-200",
    // bodyStyle: "max-w-full",
    navStyles: "bg-black border-b-black",
    p: "leading-7 [&:not(:first-child)]:mt-6",
    h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
    NavBar: Navbar,
    Footer: Footer,
  },
  typography: {
    p: "leading-7 [&:not(:first-child)]:mt-6",
    h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  },
  breadCrumbs: {
    "primary-path": "hover:text-purple-500 text-neutral-500",
    "secondary-link": "text-black hover:text-purple-500",
    "current-link": "text-purple-700",
    "icon-color": "text-neutral-400",
  },
  filter: {
    textStyles: "text-black",
    dividerStyles: "border-black",
    buttonStyles: "bg-black text-white",
    selectedStyles: "!bg-fuchsia-500 text-white",
  },
};

export type themeConfig = Record<string, Record<string, string | FC>>;
