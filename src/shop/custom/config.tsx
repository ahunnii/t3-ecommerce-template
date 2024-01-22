import Footer from "./components/footer";
import Navbar from "./modules/navigation/navbar";

export const STORE_NAME = "judy-sledge";

export const storeTheme = {
  layout: {
    mainStyle: "bg-fuchsia-200",
    // bodyStyle: "max-w-full",
    navStyles: "bg-black border-b-black",
    NavBar: Navbar,
    Footer: Footer,
  },
  filter: {
    textStyles: "text-black",
    dividerStyles: "border-black",
    buttonStyles: "bg-black text-white",
    selectedStyles: "!bg-fuchsia-500 text-white",
  },
};
