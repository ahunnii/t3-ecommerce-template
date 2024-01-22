import Footer from "./components/footer";
import Navbar from "./modules/navigation/navbar";

export const STORE_NAME = "judy-sledge";

export const storeTheme = {
  layout: {
    mainStyle: "bg-black/90",
    // bodyStyle: "max-w-full",
    navStyles: "bg-black border-b-black",
    NavBar: Navbar,
    Footer: Footer,
  },
};
