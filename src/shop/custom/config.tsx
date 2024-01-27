import Navbar from "~/shop/custom/modules/navigation/navbar";
import Footer from "./components/footer";

import * as AboutPage from "./about-template";

export const STORE_NAME = "Trend Anomaly";

export const storeTheme = {
  logo: {
    default: "/custom/logo.png",
  },
  layout: {
    mainStyle: "bg-fuchsia-200",
    // bodyStyle: "max-w-full",
    navStyles: "bg-black border-b-black",
    p: "leading-7 [&:not(:first-child)]:mt-6",
    h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
    NavBar: Navbar,
    Footer: Footer,
  },
  navigation: {},
  typography: {
    p: "leading-7 [&:not(:first-child)]:mt-6",
    h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  },
  breadCrumbs: {
    primary: "hover:text-purple-500 text-neutral-500",
    secondary: "text-black hover:text-purple-500",
    current: "text-purple-700",
    icon: "text-neutral-400",
  },
  filter: {
    textStyles: "text-black",
    dividerStyles: "border-black",
    buttonStyles: "bg-black text-white",
    selectedStyles: "!bg-fuchsia-500 text-white",
    selected: "text-fuchsia-600",
    active: "bg-fuchsia-100 text-fuchsia-900",
  },
  cart: {
    button: "bg-white text-black",
    background: "bg-black",
    price: "text-white",
    header: "text-white",
    subheader: "text-white/50",
    finePrint: "text-white/75",
  },
  product: {
    card: {
      body: "bg-black",
      imageBody: "md:aspect-[1/1.6] aspect-square",
      image: "",
      name: "text-white",
      price: "text-white",
      description: "text-white/50",
    },
  },
  collection: {
    card: {
      background: "bg-black",
      text: "text-white",
      caption: "text-white/50",
    },
  },
  contact: {
    submit: "", //"bg-purple-600 hover:bg-purple-500",
  },
};

export const storeData = {
  about: {
    metadata: AboutPage.aboutUsMetadata,
    PageContent: AboutPage.AboutTemplate,
  },
};
export type themeConfig = typeof storeTheme;
export type dataConfig = typeof storeData;
