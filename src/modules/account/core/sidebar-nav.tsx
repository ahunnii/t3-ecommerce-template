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
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
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
            pathname === item.href
              ? "bg-black text-white hover:bg-black hover:text-white/75"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
