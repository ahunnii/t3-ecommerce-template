import Footer from "~/components/custom/ta-footer.custom";
import Navbar from "~/components/wip/navigation-wip/navbar";

export const STORE_NAME = "Trend Anomaly";

export const storeTheme = {
  brand: {
    name: STORE_NAME,
    url: "https://trendanomaly.com",
    email: "ahunn@umich.edu",
  },
  logo: {
    default: "/custom/logo.png",
    alt: "/custom/logo-alt.png",
  },
  buttons: {
    accent: "bg-purple-500 hover:bg-purple-400",
  },
  layout: {
    mainStyle: "bg-fuchsia-200",

    // bodyStyle: "max-w-full",
    navStyles: "bg-black border-b-black",
    p: "leading-7 [&:not(:first-child)]:mt-6",
    h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
    h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
    h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
    h4: "scroll-m-20 text-xl font-semibold tracking-tight",
    subheader: "text-muted-foreground",

    NavBar: Navbar,
    Footer: Footer,
  },

  body: {
    primary: "bg-black",
  },

  navigation: {
    body: "bg-black border-b-black",
  },

  textColors: {
    primary: "text-black",
    accent: "text-purple-500",
  },
  signIn: {
    title: "text-black",
    background: "bg-transparent",
  },

  typography: {
    p: "leading-7 [&:not(:first-child)]:mt-6",
    h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-black",
    h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
    h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
    h4: "scroll-m-20 text-xl font-semibold tracking-tight",
    subheader: "text-muted-foreground",
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
  account: {
    typography: {
      h1: "text-3xl font-bold text-black",
      p: "text-muted-foreground",
    },
  },
};

export type themeConfig = typeof storeTheme;
