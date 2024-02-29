import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";

import { cn } from "~/utils/styles";

import { NavListItem } from "./nav-list-item";
import type { SiteLinks } from "./navbar";

interface MainNavProps {
  links: SiteLinks[];
}

const MainNav: React.FC<MainNavProps> = ({ links }) => {
  const pathname = usePathname();

  const primaryLinkStyle =
    "cursor-pointer text-neutral-500 text-sm font-medium transition-colors hover:text-purple-500 bg-transparent hover:bg-transparent focus:bg-transparent focus:text-purple-400 data-[active]:bg-transparent data-[state=open]:bg-transparent";

  const highlightStyle = "text-purple-500";
  return (
    <nav className="mx-6 flex items-center space-x-4 max-md:hidden lg:space-x-6">
      <NavigationMenu>
        <NavigationMenuList>
          {links.map((navlink, idx) => {
            if (navlink.href)
              return (
                <NavigationMenuItem key={idx + "_main"}>
                  <NavigationMenuLink
                    href={navlink.href}
                    active={pathname === navlink.href}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      primaryLinkStyle,

                      (pathname === navlink.href ||
                        pathname.startsWith(`${navlink.href}`)) &&
                        highlightStyle
                    )}
                  >
                    {navlink.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            if (navlink.links) {
              return (
                <NavigationMenuItem key={idx}>
                  <NavigationMenuTrigger
                    className={cn(
                      primaryLinkStyle,
                      (pathname === navlink?.pathname ||
                        pathname?.startsWith(`${navlink?.pathname}`)) &&
                        highlightStyle
                    )}
                  >
                    {navlink.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      {navlink.links.map((component, index) => (
                        <NavListItem
                          key={index + component.href}
                          title={component.title}
                          href={component.href}
                          className={cn(
                            (pathname === component.href ||
                              pathname?.startsWith(`${component.href}`)) &&
                              highlightStyle
                          )}
                        >
                          {component.description}
                        </NavListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              );
            }
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};

export default MainNav;
