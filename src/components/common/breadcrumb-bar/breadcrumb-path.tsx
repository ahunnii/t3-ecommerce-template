import { Slot } from "@radix-ui/react-slot";

import { forwardRef, type ElementRef, type HTMLAttributes } from "react";

import { cn } from "~/utils/styles";

export type TCrumbPath = {
  name: string;
  link?: string;
  asChild?: boolean;

  linkClassName?: string;
} & HTMLAttributes<ElementRef<"li">>;

export const BreadCrumbPath = forwardRef<HTMLLIElement, TCrumbPath>(
  (
    { name, link, className, linkClassName, children, asChild = false },
    ref
  ) => {
    const params = link
      ? ({
          "aria-current": "page",
        } as React.HTMLAttributes<HTMLLIElement>)
      : {};

    const Comp = asChild ? Slot : "a";
    return (
      <li {...params} className={cn("flex items-center", className)} ref={ref}>
        {children}
        <Comp
          href={link}
          className={cn(
            "truncate text-sm font-medium transition-colors max-md:max-w-20 ",
            linkClassName
          )}
        >
          {name}
        </Comp>
      </li>
    );
  }
);

BreadCrumbPath.displayName = "BreadCrumbPath";
