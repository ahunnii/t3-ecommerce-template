import { cn } from "~/utils/styles";
import { BreadCrumbPath, type TCrumbPath } from "./breadcrumb-path";

import { forwardRef, type ElementRef, type HTMLAttributes } from "react";
import { SlashIcon } from "~/modules/icons/slash";

type TBreadCrumbProps = {
  pathway: TCrumbPath[];
  linkClassName?: string;
  activeClassName?: string;
} & HTMLAttributes<ElementRef<"nav">>;

const Breadcrumbs = forwardRef<ElementRef<"nav">, TBreadCrumbProps>(
  ({ pathway, linkClassName, activeClassName, className, ...props }, ref) => {
    return (
      <nav
        className={cn("mb-4 flex pb-5 pt-16 ", className)}
        aria-label="Breadcrumb"
        ref={ref}
        {...props}
      >
        <ol className="inline-flex items-center space-x-1 md:space-x-1">
          <BreadCrumbPath
            link="/"
            name={"Home"}
            linkClassName={cn(
              "pb-1 text-zinc-500 hover:text-zinc-700 relative cursor-pointer after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-zinc-700 after:transition-all after:duration-300 hover:after:w-full",
              linkClassName
            )}
          ></BreadCrumbPath>

          {pathway.map((path, idx) => (
            <BreadCrumbPath
              name={path.name}
              link={path?.link}
              key={idx}
              linkClassName={cn(
                "pb-1 group transition duration-300 relative  after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0  after:transition-all after:duration-300 ",
                path?.link &&
                  "cursor-pointer text-zinc-500 hover:text-zinc-900 hover:after:w-full after:bg-zinc-700",

                path?.link && linkClassName,
                !path?.link && "text-zinc-900 after:w-full",

                !path?.link && activeClassName
              )}
            >
              <SlashIcon
                className={cn("mx-2 size-5 pb-1 text-zinc-500 ", linkClassName)}
              />
            </BreadCrumbPath>
          ))}
        </ol>
      </nav>
    );
  }
);

Breadcrumbs.displayName = "Breadcrumbs";

export default Breadcrumbs;
