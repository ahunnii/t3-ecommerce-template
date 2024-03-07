import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/utils/styles";

type Props = {
  items: {
    href: string;
    title: string;
  }[];
} & React.HTMLAttributes<HTMLElement>;

export function SidebarNav({ className, items, ...props }: Props) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex space-x-2 max-md:rounded-md lg:flex-col lg:space-x-0 lg:space-y-1 ",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href && "bg-black text-white",
            "justify-start hover:bg-purple-700  hover:text-white max-lg:grow",
            pathname !== item.href && "bg-white text-black"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
