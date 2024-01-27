export const STORE_NAME = "Trend Anomaly";

export const storeTheme = {
  logo: {
    default: "",
  },
  layout: {
    mainStyle: "",
    navStyles: "",
    p: "",
    h1: "",
    // NavBar: null,
    // Footer: null,
  },
  navigation: {},
  typography: {
    p: "",
    h1: "",
  },
  breadCrumbs: {
    primary: "",
    secondary: "",
    current: "",
    icon: "",
  },
  filter: {
    textStyles: "",
    dividerStyles: "",
    buttonStyles: "",
    selectedStyles: "",
    selected: "",
    active: "",
  },
  cart: {
    button: "",
    background: "",
    price: "",
    header: "",
    subheader: "",
    finePrint: "",
  },
  product: {
    card: {
      body: "",
      imageBody: "",
      image: "",
      name: "",
      price: "",
      description: "",
    },
  },
  collection: {
    card: {
      background: "",
      text: "",
      caption: "",
    },
  },
  contact: {
    submit: "", //"bg-purple-600 hover:bg-purple-500",
  },
};

export type themeConfig = typeof storeTheme;
